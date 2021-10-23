import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import ddbClient from '../../../src/database/common/ddbClient';

const mockUserId = 'mock-user-1234';
export const mockCustomers = [
  {
    firstName: 'George',
    lastName: 'McCarron',
    email: 'hello@georgemccarron.com',
    address: {
      streetAddress: '123 My Street',
      city: 'Nottingham',
      state: 'Nottinghamshire',
      zipCode: 'NG1 1AA',
      country: 'UK',
    },
    PK: `USER#${mockUserId}`,
    SK: `CUSTOMER#1`,
    customerId: '1',
  },
  {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john@example.com',
    address: {
      streetAddress: '10 Main Road',
      city: 'LA',
      state: 'California',
      zipCode: '12345-67890',
      country: 'Spain',
    },
    PK: `USER#${mockUserId}`,
    SK: `CUSTOMER#2`,
    customerId: '2',
  },
  {
    firstName: 'Alice',
    lastName: 'Jones',
    email: 'alice@example.com',
    address: {
      streetAddress: '22 Station Road',
      city: 'Dartford',
      state: 'Kent',
      zipCode: 'DA1 1AA',
      country: 'UK',
    },
    PK: `USER#mock-user-9999`,
    SK: `CUSTOMER#3`,
    customerId: '3',
  },
];

const insertMockCustomers = async () => {
  const params = {
    RequestItems: {
      'banking-api': mockCustomers.map((customer) => ({
        PutRequest: { Item: customer },
      })),
    },
  };
  await ddbClient.send(new BatchWriteCommand(params));
};

export default insertMockCustomers;
