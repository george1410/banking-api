import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import deleteByKey from './deleteByKey';

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

describe('Get by key', () => {
  test('should return the result of a successful deletion from the database', async () => {
    ddbMock
      .rejects('mock rejection')
      .on(DeleteCommand, { Key: { PK: 'somePK', SK: 'someSK' } })
      .resolves({ some: 'object' });

    const result = await deleteByKey('somePK', 'someSK');
    expect(result).toEqual({ some: 'object' });
  });

  test('should throw an error if the dynamodb request fails', async () => {
    ddbMock.on(DeleteCommand).rejects('mocked rejection');

    await expect(deleteByKey('somePK', 'someSK')).rejects.toEqual(Error(500));
  });
});
