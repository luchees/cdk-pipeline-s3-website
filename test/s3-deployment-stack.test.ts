import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { S3DeploymentStack } from '../lib/s3-deployment-stack';

test('S3Deployment Stack', () => {
  const app = new cdk.App();
  const stack = new S3DeploymentStack(app, 'MyTestStack', {
    config: {
      url: 'test.website.com',
      folder: 'portfolio',
      domainName: 'website.com'
    },
    websiteName: 'tests',
    env: { region: 'eu-west-1', account: '11111111111' }
  });
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
