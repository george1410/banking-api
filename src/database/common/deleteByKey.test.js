import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import deleteByKey from './deleteByKey';

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

describe('Delete by key', () => {
  test('should return the result of a successful deletion from the database', async () => {
    ddbMock
      .rejects('mock rejection')
      .on(DeleteCommand, { Key: { PK: 'somePK', SK: 'someSK' } })
      .resolves({ Attributes: { PK: 'somePK', SK: 'someSK' } });

    const result = await deleteByKey('somePK', 'someSK');
    expect(result).toEqual({ PK: 'somePK', SK: 'someSK' });
  });

  test('should return null if the item to delete does not exist', async () => {
    ddbMock
      .rejects('mock rejection')
      .on(DeleteCommand, { Key: { PK: 'somePK', SK: 'someSK' } })
      .resolves({ Attributes: undefined });

    const result = await deleteByKey('somePK', 'someSK');
    expect(result).toBeNull();
  });

  test('should throw an error if the dynamodb request fails', async () => {
    ddbMock.on(DeleteCommand).rejects('mocked rejection');

    await expect(deleteByKey('somePK', 'someSK')).rejects.toEqual(Error(500));
  });
});
