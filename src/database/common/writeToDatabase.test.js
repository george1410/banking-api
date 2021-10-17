import { mockClient } from 'aws-sdk-client-mock';
import {
  DynamoDBDocumentClient,
  BatchWriteCommand,
} from '@aws-sdk/lib-dynamodb';
import writeToDatabase from './writeToDatabase';

const ddbMock = mockClient(DynamoDBDocumentClient);

beforeEach(() => {
  ddbMock.reset();
});

describe('Write to database', () => {
  test('should write all items to the database at once if there are 25 or fewer', async () => {
    const items = [];
    for (let i = 0; i < 25; i++) {
      items.push({ PK: i });
    }

    ddbMock.rejects('mocked rejection').on(BatchWriteCommand).resolves({
      success: true,
    });

    await writeToDatabase(items);

    const firstBatch = ddbMock
      .call(0)
      .firstArg.input.RequestItems['banking-api'].map(
        (itm) => itm.PutRequest.Item
      );

    expect(firstBatch).toEqual(items);
  });

  test('should write all items to the database in 2 batches if there are more than 25', async () => {
    const items = [];
    for (let i = 0; i < 40; i++) {
      items.push({ PK: i });
    }

    ddbMock.rejects('mocked rejection').on(BatchWriteCommand).resolves({
      success: true,
    });

    await writeToDatabase(items);

    expect(ddbMock.calls()).toHaveLength(2);

    const firstBatch = ddbMock
      .call(0)
      .firstArg.input.RequestItems['banking-api'].map(
        (itm) => itm.PutRequest.Item
      );

    const secondBatch = ddbMock
      .call(1)
      .firstArg.input.RequestItems['banking-api'].map(
        (itm) => itm.PutRequest.Item
      );

    expect([...firstBatch, ...secondBatch]).toEqual(items);
  });

  test('should throw an error if the dynamodb request fails', async () => {
    ddbMock.on(BatchWriteCommand).rejects('mocked rejection');

    await expect(writeToDatabase([{ PK: 'abc' }])).rejects.toEqual(Error(500));
  });
});
