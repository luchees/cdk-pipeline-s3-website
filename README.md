# CDK pipeline for static website hosting in s3

# Setup

`npm`

`npm test`

bootstrap aws:
`npm cdk bootstrap aws://<aws-acccount>/<bootstrap-region> --profile <profile>`

to deploy:
`npm cdk deploy CdkPipelineWebsites --parameters parameter=<github-oauth-token> --profile <profile>`

# Set up domain

add hosted zone for domain in route 53. Use the domain name as the `domainName` in the config file.

# Add website

create a folder in websites/

add url, domainName and websiteName to the `config.ts` file

add another stage in the `cdk-stage.ts` file
