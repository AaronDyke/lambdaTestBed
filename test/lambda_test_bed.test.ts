import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import cdk = require('@aws-cdk/core');
import LambdaTestBed = require('../lib/lambda_test_bed-stack');

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new LambdaTestBed.LambdaTestBedStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});