import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

let params = {};
if (process.env.NODE_ENV === 'test') {
  params = {
    region: 'us-east-1',
    endpoint: 'http://localhost:8000',
    credentials: {
      accessKeyId: 'xxx',
      secretAccessKey: 'yyy',
    },
  };
}

export const client = new DynamoDBClient(params);

const marshallOptions = {
  removeUndefinedValues: true,
};

const ddbClient = DynamoDBDocumentClient.from(client, { marshallOptions });

export default ddbClient;
