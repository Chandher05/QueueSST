import AWS from "aws-sdk";
import { Queue } from "@serverless-stack/node/queue";

const sqs = new AWS.SQS();

export async function handler() {
  for (let i = 0; i < 5; i++) { // loop to send 5 messages, can load with  more messages
    let random = Math.floor(Math.random() * 10); // Random number from 1 to 10
    await sqs
      .sendMessage({
        // sending a message to the Queue, that is bound to this POST API
        QueueUrl: Queue.Queue.queueUrl,
        MessageBody: `${random}`,
        DelaySeconds: 0
      })
      .promise();
  }

  console.log("Message queued!");

  return {
    statusCode: 200,
    body: JSON.stringify({ status: "successful" }),
  };
}