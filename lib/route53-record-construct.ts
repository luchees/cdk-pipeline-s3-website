import * as cdk from '@aws-cdk/core';
import * as route53 from '@aws-cdk/aws-route53';
import * as targets from '@aws-cdk/aws-route53-targets';
import * as cloudfront from '@aws-cdk/aws-cloudfront';
import { IBucket } from '@aws-cdk/aws-s3';
import { WebsiteConfig } from './config';

export interface ConstructProps {
  websiteName: string;
  config: WebsiteConfig;
  bucket: IBucket;
  tags?: { [key: string]: string };
}
export class Route53RecordConstruct extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: ConstructProps) {
    super(scope, id);
    const { url, domainName } = props.config;

    // CloudFront distribution that provides HTTPS
    const distribution = new cloudfront.CloudFrontWebDistribution(
      this,
      `${props.websiteName}Distribution`,
      {
        // aliasConfiguration: {
        //   acmCertRef: certArn, // Must be in us-east-1 region.
        //   names: ["app.example.com"],
        //   sslMethod: cloudfront.SSLMethod.SNI,
        //   securityPolicy: cloudfront.SecurityPolicyProtocol.TLS_V1_1_2016,
        // },
        originConfigs: [
          {
            s3OriginSource: {
              s3BucketSource: props.bucket
            },
            behaviors: [{ isDefaultBehavior: true }]
          }
        ]
      }
    );

    const zone = route53.HostedZone.fromLookup(
      scope,
      `${props.websiteName}WebsiteHostedZone`,
      { domainName: domainName }
    );

    new route53.ARecord(scope, `${props.websiteName}Arecord`, {
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution)
      ),
      zone: zone,
      recordName: url,
      comment: `record for ${props.websiteName}`
    });
  }
}
