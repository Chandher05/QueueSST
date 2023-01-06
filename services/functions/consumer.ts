
import AWS from "aws-sdk";
import { DynamoDB } from "aws-sdk";
import { Table } from "@serverless-stack/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

const sqs = new AWS.SQS();

const base = 60 // 60 seconds base
const exponentialRate = 1.5 // exponential Rate for backoff
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min // calculing a random number 
const jitter = (retryCount: number) => { // adding jitter to the retry
  const temp = base * Math.pow(exponentialRate, retryCount)
  return temp / 2 + randomBetween(0, temp / 2)
}



export async function main(event: any, context: any) {

  let sqsRecords = event.Records;
  if (sqsRecords?.length > 0) {
    for await (const message of sqsRecords) {
      let { body, messageAttributes } = message;
      if (parseInt(body) > 5) { // fail message condition, can be tweaked to fail certain % of messages
        let retryCount = parseInt(messageAttributes?.retryCount?.stringValue || 0);
        console.log({ messageAttributes, body, retryCount })

        if (retryCount > 2) { // failed more than three times, move into dynamoDB table
          const params = {
            TableName: Table.FailedJobs.tableName,
            Item: {
              timestamp: Date.now(),
              message: body
            },
          };
          await dynamoDb.put(params).promise();

          //success logging to cloudwatch:
          console.log('Failed job is successfully written to DynamoDB');
        }
        else { // send the message back into the Queue
          await sqs
            .sendMessage({
              QueueUrl: "https://sqs.ap-south-1.amazonaws.com/982303353204/dev-queueAssignment-Queue",
              MessageBody: `${body}`, // sending the body
              DelaySeconds: jitter(retryCount + 1), // adding jitter to the example
              MessageAttributes: {
                retryCount: {
                  "StringValue": `${retryCount + 1}`, // adding the retry count for this message
                  "DataType": "Number"
                }
              }
            })
            .promise()
            .then(() => {
              console.log('Message sent back with delay')
            });
        }
      }

      else {
        console.log("Messaged Succesfully processed!")
      }
    }
  }
  return {};
}

