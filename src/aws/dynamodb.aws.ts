import {DynamoDB} from "@aws-sdk/client-dynamodb";

export const dynamo = new DynamoDB({region: "us-east-1",});
