import { DynamoDB } from "aws-sdk";
import { Table } from "@serverless-stack/node/table";

const dynamoDb = new DynamoDB.DocumentClient();

export async function handler() {
  const getParams = {
    // Get the table name from the environment variable
    TableName: Table.FailedJobs.tableName,
    // Get the row where the counter is called "hits"
    // Key: {

    // },
  };
  const results = await dynamoDb.scan(getParams).promise();


  console.log(results)

  return {
    statusCode: 200,
    body: results,
  };
}