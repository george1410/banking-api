import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();

const marshallOptions = {
  removeUndefinedValues: true,
};

const ddbClient = DynamoDBDocumentClient.from(client, { marshallOptions });

const getByKey = async (PK, SK) => {
  const params = {
    TableName: 'banking-api',
    Key: {
      PK,
      SK,
    },
  };

  try {
    return (await ddbClient.send(new GetCommand(params))).Item;
  } catch (err) {
    throw new Error(500);
  }
};

export default getByKey;
