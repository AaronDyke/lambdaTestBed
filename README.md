# Lambda Test Bed using AWS CDK
This project allows a task/function to be deployed to multiple lambda functions of varying memory size to find the cost/memory trade-off
## Build
To build this app, you need to be in this example's root folder. Then run the following:
```
npm install -g aws-cdk
npm install
npm run build
```

This will install the necessary CDK, then this example's dependencies, and then build your TypeScript files and your CloudFormation template.
## Deploy
Run `cdk deploy`. This will deploy / redeploy your Stack to your AWS Account.

## Useful Commands
 * `npm run build`   compile typescript to js
 * `npm run watch`   watch for changes and compile
 * `npm run ugly`    installs dependencies, compile typescript, and synthesize CloudFormation template
 * `npm run pretty`  deletes package-lock, node-modules, cdk-out, and all .js/.d.ts files 
 * `cdk deploy`      deploy this stack to your default AWS account/region
 * `cdk diff`        compare deployed stack with current state
 * `cdk synth`       emits the synthesized CloudFormation template
