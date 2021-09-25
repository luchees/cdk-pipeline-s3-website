import * as cdk from "@aws-cdk/core";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as s3 from "@aws-cdk/aws-s3";
import { StackProps } from "@aws-cdk/core";
import { Route53RecordConstruct } from "./route53-record-construct";
import { websiteConfig } from "./config";

export interface ExtStackProps extends StackProps {
  websiteName: string;
  config: websiteConfig;
  tags?: { [key: string]: string };
}
export class S3DeploymentStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ExtStackProps) {
    super(scope, id, props);

    const { folder, url } = props.config;

    const websiteBucket = new s3.Bucket(this, `${props.websiteName}Bucket`, {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    const deployment = new s3deploy.BucketDeployment(
      this,
      `${props.websiteName}Deployment`,
      {
        sources: [s3deploy.Source.asset(`${folder}`)],
        destinationBucket: websiteBucket,
        destinationKeyPrefix: "web/static",
        retainOnDelete: false,
      }
    );
    new Route53RecordConstruct(this, `${props.websiteName}Construct`, {
      bucket: websiteBucket,
      url: url,
      website: props.websiteName,
    });
  }
}
