#!/usr/bin/env node
import 'source-map-support/register';
import cdk = require('@aws-cdk/core');
import { LambdaTestBedStack } from '../lib/lambda_test_bed-stack';

const app = new cdk.App();
new LambdaTestBedStack(app, 'LambdaTestBedStack');
