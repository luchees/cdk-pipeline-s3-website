import * as cdk from "@aws-cdk/core";
import * as route53 from "@aws-cdk/aws-route53";
import * as targets from "@aws-cdk/aws-route53-targets";
import { WebsiteStage } from "./pipeline/cdk-stage";
import { IBucket } from "@aws-cdk/aws-s3";

export interface ConstructProps {
  website: string;
  url: string;
  bucket: IBucket;
  tags?: { [key: string]: string };
}
export class Route53RecordConstruct extends cdk.Construct {
  constructor(scope: cdk.Construct, id: string, props: ConstructProps) {
    super(scope, id);

    const zone = new route53.HostedZone(
      this,
      `${props.website}WebsiteHostedZone`,
      {
        zoneName: props.url,
        comment: `zone for ${props.url}`,
      }
    );

    new route53.ARecord(this, `${props.website}Arecord`, {
      target: route53.RecordTarget.fromAlias(
        new targets.BucketWebsiteTarget(props.bucket)
      ),
      zone: zone,
      comment: `record for ${props.website}`,
    });
  }
}
