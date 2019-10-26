import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');

const lambdaTimeout = 10; // timeout in seconds for all lambda functions

const minLambdaSize = 128;
const maxLambdaSize = 3008;

export class LambdaTestBedStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    let lambdaMemories = lambdaMemoryRange(128, 512, 128); // Change this (Start memory size, End memory size, step)
    if (lambdaMemories) {
      lambdaMemories.forEach(testMemorySize => {
        let lambdaName = `test${testMemorySize.toString()}MbLambda`;
        new lambda.Function(this, lambdaName, {
          code: lambda.Code.fromAsset('./function'),
          handler: "index.handler",
          runtime: lambda.Runtime.NODEJS_10_X,
          memorySize: testMemorySize,
          timeout: cdk.Duration.seconds(lambdaTimeout)
        })
      });
    }
  }
}

function lambdaMemoryRange(start: number, end: number, step: number = 64) {
  if (start > end) [start, end] = [end, start]; // swap values if start is larger than end
  if (start < minLambdaSize) start = minLambdaSize; // make sure memory isn't too small
  if (end > maxLambdaSize) end = maxLambdaSize; // make sure memory isn't too big
  if (start % 64 !== 0 || step % 64 !== 0) return; // check if a correct multiple

  let array: number[] = [];
  for (let i = start; i <= end; i += step) {
    array.push(i);
  }
  return array;
}

const app = new cdk.App();
new LambdaTestBedStack(app, 'LambdaTestBed');
app.synth();