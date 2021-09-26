import * as cdk from "@aws-cdk/core";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as s3 from "@aws-cdk/aws-s3";
import { StackProps, Tag, Tags } from "@aws-cdk/core";
import { Route53RecordConstruct } from "./route53-record-construct";
import { WebsiteConfig } from "./config";

export interface ExtStackProps extends StackProps {
  websiteName: string;
  config: WebsiteConfig;
}
export class S3DeploymentStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ExtStackProps) {
    super(scope, id, props);

    const { folder } = props.config;

    const websiteBucket = new s3.Bucket(this, `${props.websiteName}Bucket`, {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    });

    const deployment = new s3deploy.BucketDeployment(
      this,
      `${props.websiteName}Deployment`,
      {
        sources: [s3deploy.Source.asset(`websites/${folder}`)],
        destinationBucket: websiteBucket,
      }
    );
    const route53Record = new Route53RecordConstruct(
      this,
      `${props.websiteName}Construct`,
      {
        bucket: websiteBucket,
        config: props.config,
        websiteName: props.websiteName,
      }
    );
  }
}
