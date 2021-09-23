import * as codepipeline from "@aws-cdk/aws-codepipeline";
import { GitHubSourceAction } from "@aws-cdk/aws-codepipeline-actions";
import {
  CfnParameter,
  Construct,
  RemovalPolicy,
  SecretValue,
  Stack,
  StackProps,
} from "@aws-cdk/core";
import { PolicyStatement } from "@aws-cdk/aws-iam";
import { Bucket } from "@aws-cdk/aws-s3";
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
    const pipeline = new codepipeline.Pipeline(
      this,
      "PersonalWebsitesPipeline",
      {
        pipelineName: `personal-websites-cdkpipeline`,
        crossAccountKeys: false,
        artifactBucket: new Bucket(this, "websiteArtifactsBucket", {
          autoDeleteObjects: true,
          removalPolicy: RemovalPolicy.DESTROY,
          bucketName: "artifacts-bucket-cdkpipeline",
        }),
      }
    );
    const cdkPipeline = new CdkPipeline(this, `PersonalWebsitesCodePipeline`, {
      cloudAssemblyArtifact: cloudAssemblyArtifact,
      codePipeline: pipeline,
      sourceAction: new GitHubSourceAction({
        actionName: "source-github-action",
        oauthToken: SecretValue.cfnParameter(param), // Cheap solution
        owner: "luchees",
        repo: "portfolio",
        branch: "main",
        output: sourceArtifact,
      }),
      synthAction: new SimpleSynthAction({
        projectName: `personal-websites-synth-project`,
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

    const portfolioWebsiteStage = new WebsiteStage(
      this,
      `portfolio-website-WebsiteStage`,
      {
        config: config["portfolio-website"],
        website: "portfolio-website",
      }
    );
    cdkPipeline.addApplicationStage(portfolioWebsiteStage);
  }
}
