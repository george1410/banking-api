import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DeleteCommand, DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();

const marshallOptions = {
  removeUndefinedValues: true,
};

const ddbClient = DynamoDBDocumentClient.from(client, { marshallOptions });

const deleteByKey = async (PK, SK) => {
  const params = {
    TableName: 'banking-api',
    Key: {
      PK,
      SK,
    },
  };

  try {
    return await ddbClient.send(new DeleteCommand(params));
  } catch (err) {
    throw new Error(500);
  }
};

export default deleteByKey;
