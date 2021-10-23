import { DeleteTableCommand } from '@aws-sdk/client-dynamodb';
import { client } from '../../src/database/common/ddbClient';

export default async () => {
  const params = {
    TableName: 'banking-api',
  };

  await client.send(new DeleteTableCommand(params));
};
