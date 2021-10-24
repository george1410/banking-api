/* eslint-disable no-param-reassign */
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
  DynamoDBDocumentClient,
  QueryCommand,
  BatchWriteCommand,
} = require('@aws-sdk/lib-dynamodb');
const jwt = require('jsonwebtoken');

const toChunks = (arr, chunkSize) =>
  arr.reduce((all, one, i) => {
    const ch = Math.floor(i / chunkSize);
    all[ch] = [].concat(all[ch] || [], one);
    return all;
  }, []);

const clearUserData = async () => {
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
  } else {
    params = {
      region: 'us-east-1',
    };
  }

  const client = new DynamoDBClient(params);

  const marshallOptions = {
    removeUndefinedValues: true,
  };

  const ddbClient = DynamoDBDocumentClient.from(client, { marshallOptions });

  const { sub: userId } = jwt.decode(process.env.BEARER_TOKEN);

  const KeyConditionExpression = 'PK = :PK';
  const ExpressionAttributeValues = {
    ':PK': `USER#${userId}`,
  };

  const itemsToDelete = (
    await ddbClient.send(
      new QueryCommand({
        TableName: 'banking-api',
        ExpressionAttributeValues,
        KeyConditionExpression,
      })
    )
  ).Items;

  const requests = itemsToDelete.map(({ PK, SK }) => ({
    DeleteRequest: {
      Key: {
        PK,
        SK,
      },
    },
  }));

  const chunkedRequests = toChunks(requests, 25);

  const dbCommands = [];
  for (const chunk of chunkedRequests) {
    dbCommands.push(
      ddbClient.send(
        new BatchWriteCommand({
          RequestItems: {
            'banking-api': chunk,
          },
        })
      )
    );
  }

  await Promise.all(dbCommands);
};

module.exports.default = clearUserData;
