import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();

const marshallOptions = {
  removeUndefinedValues: true,
};

const ddbClient = DynamoDBDocumentClient.from(client, { marshallOptions });

const updateItem = async (
  PK,
  SK,
  UpdateExpression,
  ExpressionAttributeValues
) => {
  const params = {
    TableName: 'banking-api',
    Key: {
      PK,
      SK,
    },
    UpdateExpression,
    ExpressionAttributeValues,
  };

  try {
    return await ddbClient.send(new UpdateCommand(params));
  } catch (err) {
    console.error(err);
    throw new Error(500);
  }
};

export default updateItem;
