import { SynthUtils } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { CdkPipelineWebsites } from '../lib/pipeline/cdk-pipeline';

test('cdkPipeline Stack', () => {
  const app = new cdk.App();
  const stack = new CdkPipelineWebsites(app, 'MyTestStack', {
    env: { region: 'eu-west-1', account: '585191031104' }
  });
  expect(SynthUtils.toCloudFormation(stack)).toMatchSnapshot();
});
