
import { StackContext, Queue, Api, Table } from "@serverless-stack/resources";

export function MyStack({ stack }: StackContext) {
  // Create Queue
  // const queue = new Queue(stack, "Queue", {
  //   consumer: "functions/consumer.main",
  //   cdk: {
  //     queue: {

  //     }
  //   }
  // });
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

  // Create the HTTP API
  const api = new Api(stack, "Api", {
    defaults: {
      function: {
        // Bind the table name to our API
        bind: [queue],
      },
    },
    routes: {
      "POST /": "functions/lambda.handler",
    },
  });

  // Show the API endpoint in the output
  stack.addOutputs({
    ApiEndpoint: api.url,
  });


  // Create a table 

  // new Table(stack, "Notes", {
  //   fields: {
  //     timestamp: "number",
  //     message: "string",
  //   },
  //   primaryIndex: { partitionKey: "timestamp" },
  // });
}

