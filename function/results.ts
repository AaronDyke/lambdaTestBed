import { Handler, Context } from 'aws-lambda';
import { TestBedResult, lambdaTimeout } from './testBedCommon';


export const handler: Handler = async (event: any, context: Context) => {
    let results = ingestResults(event);
    results = calculateCost(results)
    return results;
}

function ingestResults(resultsArray: any[]) {
    let parsedResults = resultsArray.map((result: any) => {
        if (result.body) {
            return JSON.parse(result.body) as TestBedResult;
        } else {
            return result;
        }
    })
    return parsedResults;
}

function calculateCost(results: TestBedResult[]){
    results.forEach(run => {
        let memoryString = (run.memory).toString();
        let costPer100ms = lambdaPricing[memoryString];
        let msRun = (lambdaTimeout * 1000) - run.remainingTime;
        let chargeableMs = Math.ceil(msRun / 100) * 100; // rounding up to next 100ms
        run.cost = costPer100ms * (chargeableMs/100)
    })
    return results
}

const lambdaPricing: {[key: string]: number}= {
    '128': 0.000000208,
    '192': 0.000000313,
    '256': 0.000000417,
    '320': 0.000000521,
    '384': 0.000000625,
    '448': 0.000000729,
    '512': 0.000000834,
    '576': 0.000000938,
    '640': 0.000001042,
    '704': 0.000001146,
    '768': 0.000001250,
    '832': 0.000001354,
    '896': 0.000001459,
    '960': 0.000001563,
    '1024': 0.000001667,
    '1088': 0.000001771,
    '1152': 0.000001875,
    '1216': 0.000001980,
    '1280': 0.000002084,
    '1344': 0.000002188,
    '1408': 0.000002292,
    '1472': 0.000002396,
    '1536': 0.000002501,
    '1600': 0.000002605,
    '1664': 0.000002709,
    '1728': 0.000002813,
    '1792': 0.000002917,
    '1856': 0.000003021,
    '1920': 0.000003126,
    '1984': 0.000003230,
    '2048': 0.000003334,
    '2112': 0.000003438,
    '2176': 0.000003542,
    '2240': 0.000003647,
    '2304': 0.000003751,
    '2368': 0.000003855,
    '2432': 0.000003959,
    '2496': 0.000004063,
    '2560': 0.000004168,
    '2624': 0.000004272,
    '2688': 0.000004376,
    '2752': 0.000004480,
    '2816': 0.000004584,
    '2880': 0.000004688,
    '2944': 0.000004793,
    '3008': 0.000004897
}