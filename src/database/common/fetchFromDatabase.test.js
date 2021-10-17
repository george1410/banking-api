import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import fetchFromDatabase from './fetchFromDatabase';

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

describe('Fetch from database', () => {
  test('should return the requested items from the database main table', async () => {
    ddbMock
      .rejects('mock rejection')
      .on(QueryCommand, {
        ExpressionAttributeValues: {
          ':PK': 'somePK',
          ':SK': 'someSK',
        },
        KeyConditionExpression: 'PK = :PK and SK = :SK',
      })
      .resolves({
        Items: [
          { PK: 'somePK', SK: 'somSK', some: 'object' },
          { PK: 'somePK', SK: 'somSK', some: 'otherObject' },
        ],
      });

    const items = await fetchFromDatabase('PK = :PK and SK = :SK', {
      ':PK': 'somePK',
      ':SK': 'someSK',
    });

    expect(items).toEqual([
      { PK: 'somePK', SK: 'somSK', some: 'object' },
      { PK: 'somePK', SK: 'somSK', some: 'otherObject' },
    ]);
  });

  test('should return the requested items from the database on an index', async () => {
    ddbMock
      .rejects('mock rejection')
      .on(QueryCommand, {
        ExpressionAttributeValues: {
          ':PK': 'somePK',
          ':SK': 'someSK',
        },
        KeyConditionExpression: 'PK = :PK and SK = :SK',
        IndexName: 'myIndex',
      })
      .resolves({
        Items: [
          { PK: 'somePK', SK: 'somSK', some: 'object' },
          { PK: 'somePK', SK: 'somSK', some: 'otherObject' },
        ],
      });

    const items = await fetchFromDatabase(
      'PK = :PK and SK = :SK',
      {
        ':PK': 'somePK',
        ':SK': 'someSK',
      },
      'myIndex'
    );

    expect(items).toEqual([
      { PK: 'somePK', SK: 'somSK', some: 'object' },
      { PK: 'somePK', SK: 'somSK', some: 'otherObject' },
    ]);
  });

  test('should return an empty array if there are no matching items', async () => {
    ddbMock
      .rejects('mock rejection')
      .on(QueryCommand, {
        ExpressionAttributeValues: {
          ':PK': 'somePK',
          ':SK': 'someSK',
        },
        KeyConditionExpression: 'PK = :PK and SK = :SK',
      })
      .resolves({
        Count: 0,
        Items: [],
      });

    const items = await fetchFromDatabase('PK = :PK and SK = :SK', {
      ':PK': 'somePK',
      ':SK': 'someSK',
    });

    expect(items).toEqual([]);
  });

  test('should throw an error if the dynamodb request fails', async () => {
    ddbMock.on(QueryCommand).rejects('mocked rejection');

    await expect(
      fetchFromDatabase('PK = :PK and SK = :SK', {
        ':PK': 'somePK',
        ':SK': 'someSK',
      })
    ).rejects.toEqual(Error(500));
  });
});
