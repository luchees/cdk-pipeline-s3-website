import * as codepipeline from "@aws-cdk/aws-codepipeline";
import { GitHubSourceAction } from "@aws-cdk/aws-codepipeline-actions";
import {
  CfnParameter,
  Construct,
  SecretValue,
  Stack,
  StackProps,
} from "@aws-cdk/core";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { config } from "../config";
import { WebsiteStage } from "./cdk-stage";

export class CdkPipelineWebsites extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const param = new CfnParameter(this, "parameter", {
      type: "String",
      noEcho: true,
    });
    const cdkPipeline = new CdkPipeline(this, `MultiWebsitesCodePipeline`, {
      pipelineName: "multi-website-cdkpipeline",
      cloudAssemblyArtifact: cloudAssemblyArtifact,
      crossAccountKeys: false,
      sourceAction: new GitHubSourceAction({
        actionName: "source-github-action",
        oauthToken: SecretValue.cfnParameter(param), // Cheap solution
        owner: "luchees",
        repo: "cdk-pipeline-s3-website",
        branch: "main",
        output: sourceArtifact,
      }),

      synthAction: new SimpleSynthAction({
        projectName: `multi-websites-synth-project`,
        sourceArtifact,
        cloudAssemblyArtifact,
        installCommands: ["yarn install"],
        buildCommands: ["yarn build"],
        testCommands: [`yarn test`],
        synthCommand: `yarn cdk synth`,
        rolePolicyStatements: [
          new PolicyStatement({
            actions: ["ec2:Describe*"],
            resources: ["*"],
          }),
        ],
      }),
    });

    const multiSiteWebsiteStage = new WebsiteStage(
      this,
      `portfolio-website-stage`,
      {
        config: config["portfolio-website"],
        website: "portfolio-website",
        env: { region: "eu-west-1" },
      }
    );
    cdkPipeline.addApplicationStage(multiSiteWebsiteStage);
  }
}
