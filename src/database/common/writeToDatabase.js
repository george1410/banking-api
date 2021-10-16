import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import toChunks from '../../lib/toChunks';

const client = new DynamoDBClient();
const ddbClient = DynamoDBDocument.from(client);

const writeToDatabase = async (items) => {
  const requests = items.map((item) => ({
    PutRequest: {
      Item: {
        ...item,
      },
    },
  }));

  const chunkedRequests = toChunks(requests, 25);

  for (const chunk of chunkedRequests) {
    const params = {
      RequestItems: {
        'banking-api': chunk,
      },
    };

    try {
      await ddbClient.batchWrite(params);
    } catch (err) {
      console.error(err);
      throw new Error(500);
    }
  }
};

export default writeToDatabase;
