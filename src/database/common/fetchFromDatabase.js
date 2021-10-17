import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import ddbClient from './ddbClient';

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
    throw new Error(500);
  }
};

export default fetchFromDatabase;
