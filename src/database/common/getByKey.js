import { GetCommand } from '@aws-sdk/lib-dynamodb';
import ddbClient from './ddbClient';

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
