import * as cdk from "@aws-cdk/core";
import * as route53 from "@aws-cdk/aws-route53";
import * as targets from "@aws-cdk/aws-route53-targets";
import { IBucket } from "@aws-cdk/aws-s3";
import { WebsiteConfig } from "./config";

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
    const zone = route53.HostedZone.fromLookup(
      scope,
      `${props.websiteName}WebsiteHostedZone`,
      { domainName: domainName }
    );

    new route53.ARecord(scope, `${props.websiteName}Arecord`, {
      target: route53.RecordTarget.fromAlias(
        new targets.BucketWebsiteTarget(props.bucket)
      ),
      zone: zone,
      recordName: url,
      comment: `record for ${props.websiteName}`,
    });
  }
}
