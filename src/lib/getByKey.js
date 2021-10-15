import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient();

const marshallOptions = {
  removeUndefinedValues: true,
};

const ddbClient = DynamoDBDocument.from(client, { marshallOptions });

const getByKey = async (PK, SK, ProjectionExpression = null) => {
  const params = {
    TableName: 'banking-api',
    Key: {
      PK,
      SK,
    },
    ProjectionExpression,
  };

  try {
    return (await ddbClient.get(params)).Item;
  } catch (err) {
    console.error(err);
    throw new Error(500);
  }
};

export default getByKey;
