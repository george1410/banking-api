import { mockClient } from 'aws-sdk-client-mock';
import { DynamoDBDocumentClient, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import updateItem from './updateItem';

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

describe('Update item', () => {
  test('should update the item in the database', async () => {
    ddbMock
      .rejects('mocked rejection')
      .on(UpdateCommand, {
        Key: {
          PK: 'somePK',
          SK: 'someSK',
        },
        UpdateExpression: 'someUpdateExpression',
        ExpressionAttributeValues: {
          ':a': 'blah',
        },
      })
      .resolves({
        success: true,
      });

    const result = await updateItem(
      'somePK',
      'someSK',
      'someUpdateExpression',
      { ':a': 'blah' }
    );
    expect(result).toEqual({ success: true });
  });

  test('should throw an error if the dynamodb request fails', async () => {
    ddbMock.on(UpdateCommand).rejects('mocked rejection');

    await expect(
      updateItem('somePK', 'someSK', 'someUpdateExpression', { ':a': 'blah' })
    ).rejects.toEqual(Error(500));
  });
});
