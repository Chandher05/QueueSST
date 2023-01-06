
import AWS from "aws-sdk";
import { DynamoDB } from "aws-sdk";
import { Table } from "@serverless-stack/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

const sqs = new AWS.SQS();

const base = 60
const exponentialRate = 1.5
const randomBetween = (min: number, max: number) => Math.random() * (max - min) + min
const jitter = (retryCount: number) => {
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

        if (retryCount > 2) {
          const params = {
            TableName: Table.FailedJobs.tableName,
            Item: {
              timestamp: Date.now(),
              message: body
            },
          };
          await dynamoDb.put(params).promise();

          //success logging to cloudwatch:
          console.log('Successfully written to DynamoDB');
        }
        else {
          await sqs
            .sendMessage({
              QueueUrl: "https://sqs.ap-south-1.amazonaws.com/982303353204/dev-queueAssignment-Queue",
              MessageBody: `${body}`,
              DelaySeconds: jitter(retryCount + 1),
              MessageAttributes: {
                retryCount: {
                  "StringValue": `${retryCount + 1}`,
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

