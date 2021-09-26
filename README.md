# CDK pipeline for static website hosting in s3

This repo has been created for easy creation of static websites in AWS.
It has been developed in Typescript using the AWS-CDK.
We are using cdk-pipelines as CI/CD pipeline.
Cost is around 1 euro per month and 5 euro per year for a domain ( minus tax )

## Prerequisites

- AWS account and CLI credentials https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-configure.html
- npm and nodejs https://docs.npmjs.com/downloading-and-installing-node-js-and-npm

## Setup

```
npm
npm test
```

bootstrap aws:

```
npm cdk bootstrap aws://<aws-acccount>/<bootstrap-region> --profile <profile>
```

to deploy:

```
npm cdk deploy CdkPipelineWebsites --parameters parameter=<github-oauth-token> --profile <profile>
```

### Set up AWS

Add account and region win the `config.ts` file

### Set up domain

Add hosted zone for domain in route 53. Use the domain name as the `domainName` in the `config.ts` file.

### Add website

Add your web folder in websites/ directory

Add url and websiteName to the `config.ts` file
