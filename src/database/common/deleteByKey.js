import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();

const marshallOptions = {
  removeUndefinedValues: true,
};

const ddbClient = DynamoDBDocument.from(client, { marshallOptions });

const deleteByKey = async (PK, SK) => {
  const params = {
    TableName: 'banking-api',
    Key: {
      PK,
      SK,
    },
  };

  try {
    return await ddbClient.delete(params);
  } catch (err) {
    console.error(err);
    throw new Error(500);
  }
};

export default deleteByKey;