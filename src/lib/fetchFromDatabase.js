import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();

const marshallOptions = {
  removeUndefinedValues: true,
};

const ddbClient = DynamoDBDocument.from(client, { marshallOptions });

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
    return (await ddbClient.query(params)).Items;
  } catch (err) {
    console.error(err);
    throw new Error(500);
  }
};

export default fetchFromDatabase;
