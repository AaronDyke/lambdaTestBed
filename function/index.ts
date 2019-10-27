import { Handler, APIGatewayEvent, Context } from 'aws-lambda';
import { TestBedResult } from './testBedCommon';

let firstRun = true;

function fib (n: number):number {
    if (n < 2){
      return n
    }
    return fib(n - 1) + fib (n - 2)
  }

export const handler: Handler = async (event: APIGatewayEvent, context: Context) => {

    let coldStart = firstRun;
    firstRun = false;

    const number = fib(35);

    let returnBody: TestBedResult = {
        isColdStart: coldStart,
        remainingTime: context.getRemainingTimeInMillis(),
        memory: context.memoryLimitInMB,
        answer: number
    }
    return {
        statusCode: 200,
        body : JSON.stringify(returnBody) 
    }
}