import cdk = require('@aws-cdk/core');
import lambda = require('@aws-cdk/aws-lambda');
import sfn = require('@aws-cdk/aws-stepfunctions');
import tasks = require('@aws-cdk/aws-stepfunctions-tasks');
import { lambdaTimeout } from './function/testBedCommon';

const smallestLambdaMemory: number = 128; // in Mb must be a multiple of 64 and >= 128mb
const largestLambdaMemory: number = 256; // in Mb must be a multiple of 64 and <= 3008mb
const memoryStep: number = 128 // incrementation in Mb of lambda functions must be a multiple of 64 
const concurrency = 1;

export class LambdaTestBedStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const parallel = new sfn.Parallel(this, 'Run all lambdas in parallel', {
      resultPath: '$.results'
    });

    // creating the test bed lambdas
    let lambdaMemories = lambdaMemoryRange(smallestLambdaMemory, largestLambdaMemory, memoryStep); // Change this (Start memory size, End memory size, step)
    if (lambdaMemories) {
      lambdaMemories.forEach(testMemorySize => {
        let lambdaName = `test${testMemorySize.toString()}MbLambda`;
        
        let currLambda = new lambda.Function(this, lambdaName, {
          code: lambda.Code.fromAsset('./function'),
          handler: "index.handler",
          runtime: lambda.Runtime.NODEJS_10_X,
          memorySize: testMemorySize,
          timeout: cdk.Duration.seconds(lambdaTimeout)
        })

        for (let i = 0; i < concurrency; i++) {
          // creating task to invoke lambda
          let currTask = new sfn.Task(this, `${lambdaName}Task${i}`, {
            task: new tasks.InvokeFunction(currLambda)
          })

          // add task to parallel state
          parallel.branch(currTask);
        }


      });
    }

    let resultsLambda = new lambda.Function(this, 'testBedResults', {
      code: lambda.Code.fromAsset('./function'),
      handler: "results.handler",
      runtime: lambda.Runtime.NODEJS_10_X
    })

    let getResults = new sfn.Task(this, 'Results Lambda', {
      task: new tasks.InvokeFunction(resultsLambda),
      inputPath: '$.results',
    })

    // create state machine definition
    const definition = parallel.next(getResults);
    // create state machine with definition
    new sfn.StateMachine(this, 'Lambda Test Bed', {
      definition,
      timeout: cdk.Duration.minutes(5)
    });
  }
}

function lambdaMemoryRange(start: number, end: number, step: number = 64) {
  const minLambdaSize = 128;
  const maxLambdaSize = 3008;

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