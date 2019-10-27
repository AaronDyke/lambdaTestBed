export const lambdaTimeout = 10; // timeout in seconds for all lambda functions

export interface TestBedResult {
    isColdStart: boolean,
    remainingTime: number,
    memory: number,
    answer: any,
    cost?: number
}