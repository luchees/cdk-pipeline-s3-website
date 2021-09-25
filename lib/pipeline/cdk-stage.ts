import {
  Construct,
  DefaultStackSynthesizer,
  Stage,
  StageProps,
} from "@aws-cdk/core";
import { websiteConfig } from "../config";
import { S3DeploymentStack } from "../s3-deployment-stack";

export interface ExtStageProps extends StageProps {
  website: string;
  config: websiteConfig;
  tags?: { [key: string]: string };
}

export class WebsiteStage extends Stage {
  constructor(scope: Construct, id: string, props: ExtStageProps) {
    super(scope, id, props);

    const s3deploymentStack = new S3DeploymentStack(
      this,
      `${props.website}-deployment-stack`,
      {
        stackName: `${props.website}-deployment-stack`,
        description: `s3 deployment bucket for ${props.website}`,
        terminationProtection: true,
        tags: props.tags,
        env: props.env,
        config: props.config,
        websiteName: props.website,
        synthesizer: new DefaultStackSynthesizer(),
      }
    );
  }
}
