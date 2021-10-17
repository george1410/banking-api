import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import ddbClient from './ddbClient';

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
    throw new Error(500);
  }
};

export default updateItem;
