import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();

const marshallOptions = {
  removeUndefinedValues: true,
};

const ddbClient = DynamoDBDocumentClient.from(client, { marshallOptions });

const fetchFromDatabase = async (
  KeyConditionExpression,
  ExpressionAttributeValues,
  IndexName = null
) => {
  const params = {
    TableName: 'banking-api',
    ExpressionAttributeValues,
    KeyConditionExpression,
    IndexName,
  };

  try {
    return (await ddbClient.send(new QueryCommand(params))).Items;
  } catch (err) {
    console.error(err);
    throw new Error(500);
  }
};

export default fetchFromDatabase;
