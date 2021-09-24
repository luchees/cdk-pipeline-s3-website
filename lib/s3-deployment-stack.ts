import * as cdk from "@aws-cdk/core";
import * as s3deploy from "@aws-cdk/aws-s3-deployment";
import * as s3 from "@aws-cdk/aws-s3";
import { StackProps } from "@aws-cdk/core";

export interface ExtStackProps extends StackProps {
  website: string;
  folder: string;
  tags?: { [key: string]: string };
}
export class S3DeploymentStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: ExtStackProps) {
    super(scope, id, props);

    const websiteBucket = new s3.Bucket(this, `${props.website}WebsiteBucket`, {
      websiteIndexDocument: "index.html",
      publicReadAccess: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    new s3deploy.BucketDeployment(this, `${props.website}DeployWebsite`, {
      sources: [s3deploy.Source.asset(`${props.folder}`)],
      destinationBucket: websiteBucket,
      destinationKeyPrefix: "web/static",
      retainOnDelete: false,
    });
  }
}
