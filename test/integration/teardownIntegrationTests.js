import { DeleteTableCommand } from '@aws-sdk/client-dynamodb';
import { client } from '../../src/database/common/ddbClient';

export default async () => {
  const params = {
    TableName: 'banking-api',
  };

  try {
    await client.send(new DeleteTableCommand(params));
  } catch (err) {}
};
