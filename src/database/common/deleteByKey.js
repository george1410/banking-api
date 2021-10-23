import { DeleteCommand } from '@aws-sdk/lib-dynamodb';
import ddbClient from './ddbClient';

const deleteByKey = async (PK, SK) => {
  const params = {
    TableName: 'banking-api',
    Key: {
      PK,
      SK,
    },
    ReturnValues: 'ALL_OLD',
  };

  try {
    const { Attributes: deletedItem } = await ddbClient.send(
      new DeleteCommand(params)
    );
    return deletedItem ?? null;
  } catch (err) {
    throw new Error(500);
  }
};

export default deleteByKey;
