
import { StackContext, Queue, Api, Table } from "@serverless-stack/resources";

export function MyStack(this: any, { stack }: StackContext) {

  //Table created for failedJobs
  const table = new Table(stack, "FailedJobs", { // table to store the failed messages 
    fields: {
      timestamp: "number",
      message: "string",
    },
    primaryIndex: { partitionKey: "timestamp" },
  });

  // SQS Queue that sends messages
  const queue = new Queue(stack, "Queue", {
    consumer: {
      function: "functions/consumer.main",
      cdk: {
        eventSource: {
          batchSize: 10,
        },
      },
    },
  });
  queue.attachPermissions(["sqs"])
  queue.bind([table])



  // This is the API to post the Queue
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        // Bind the table name to our API
        bind: [queue],
      },
    },
    routes: {
      "POST /": "functions/loadJobs.handler",
    },
  });


  // Get API - to get from the FailedJObs Table
  const getJobs = new Api(stack, "GetJobs", {
    defaults: {
      function: {
        // Bind the table name to our API
        bind: [table],
      },
    },
    routes: {
      "GET /": "functions/getfailedjobs.handler",
    },
  });

  // Outputs urls for both post and get from the table
  stack.addOutputs({
    ApiEndpoint: api.url,
    GetEndpoint: getJobs.url
  });

  return {
    table,
    queue
  }

}

