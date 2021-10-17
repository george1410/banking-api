import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import toChunks from '../../lib/toChunks';
import ddbClient from './ddbClient';

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
      await ddbClient.send(new BatchWriteCommand(params));
    } catch (err) {
      console.error(err);
      throw new Error(500);
    }
  }
};

export default writeToDatabase;
