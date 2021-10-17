import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import ddbClient from './ddbClient';

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
