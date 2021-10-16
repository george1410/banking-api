import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
import getByKey from './getByKey';

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

describe('Get by key', () => {
  test('should return the item from the database', async () => {
    ddbMock.on(GetCommand).resolves({
      Item: { PK: 'somePK', SK: 'someSK', extraStuff: 'blah' },
    });

    const item = await getByKey('somePK', 'someSK');
    expect(item).toEqual({ PK: 'somePK', SK: 'someSK', extraStuff: 'blah' });
  });

  test('should throw an error if the dynamodb request fails', async () => {
    ddbMock.on(GetCommand).rejects('mocked rejection');

    await expect(getByKey('somePK', 'someSK')).rejects.toEqual(Error(500));
  });
});
