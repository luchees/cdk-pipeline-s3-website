import * as codepipeline from "@aws-cdk/aws-codepipeline";
import { GitHubSourceAction } from "@aws-cdk/aws-codepipeline-actions";
import { Construct, SecretValue, Stack, StackProps } from "@aws-cdk/core";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { CdkPipeline, SimpleSynthAction } from "@aws-cdk/pipelines";
import { config } from "../config";
import { WebsiteStage } from "./cdk-stage";

export class CdkPipelineWebsites extends Stack {
  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const sourceArtifact = new codepipeline.Artifact();
    const cloudAssemblyArtifact = new codepipeline.Artifact();

    const pipeline = new CdkPipeline(this, `PersonalWebsitesPipeline`, {
      pipelineName: `personal-websites-cdkpipeline`,
      cloudAssemblyArtifact: cloudAssemblyArtifact,
      sourceAction: new GitHubSourceAction({
        actionName: "source-github-action",
        oauthToken: SecretValue.ssmSecure("/websites/githubtoken", "1"),
        owner: "luchees",
        repo: "portfolio",
        branch: "main",
        output: sourceArtifact,
      }),
      synthAction: new SimpleSynthAction({
        projectName: `personal-websites-synth-project`,
        sourceArtifact,
        cloudAssemblyArtifact,
        subdirectory: "cdk",
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

    const portfolioWebsiteStage = new WebsiteStage(
      this,
      `portfolio-website-WebsiteStage`,
      {
        config: config["portfolio-website"],
        website: "portfolio-website",
      }
    );
    pipeline.addApplicationStage(portfolioWebsiteStage);
  }
}
