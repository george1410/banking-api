import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import ddbClient from '../../../src/database/common/ddbClient';
import { handler } from '../../../src/functions/getAccounts/handler';

const mockUserId = 'mock-user-1234';

const mockCustomers = [
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

const mockAccounts = [
  {
    balance: 0,
    accountType: 'Current',
    PK: `USER#${mockUserId}`,
    SK: `ACCOUNT#9`,
    customerId: '2',
    GSI1PK: `USER#${mockUserId}#CUSTOMER#2`,
    GSI1SK: `ACCOUNT#9`,
    accountId: '9',
  },
  {
    balance: 12.34,
    accountType: 'Savings',
    PK: `USER#${mockUserId}`,
    SK: `ACCOUNT#8`,
    customerId: '2',
    GSI1PK: `USER#${mockUserId}#CUSTOMER#2`,
    GSI1SK: `ACCOUNT#8`,
    accountId: '8',
  },
  {
    balance: 98.76,
    accountType: 'Savings',
    PK: `USER#mock-user-9999`,
    SK: `ACCOUNT#8`,
    customerId: '3',
    GSI1PK: `USER#mock-user-9999#CUSTOMER#3`,
    GSI1SK: `ACCOUNT#8`,
    accountId: '8',
  },
];

const insertMockData = async () => {
  const params = {
    RequestItems: {
      'banking-api': [...mockCustomers, ...mockAccounts].map((item) => ({
        PutRequest: { Item: item },
      })),
    },
  };
  await ddbClient.send(new BatchWriteCommand(params));
};

beforeEach(async () => {
  await insertMockData();
});

describe('Get Accounts', () => {
  describe('get all accounts for customer', () => {
    test('should return 404 if the customer ID does not exist', async () => {
      const event = {
        requestContext: {
          authorizer: { jwt: { claims: { sub: mockUserId } } },
        },
        pathParameters: {
          customerId: '999',
        },
      };
      const response = await handler(event);

      expect(response.statusCode).toEqual(404);
      expect(response.headers).toEqual({
        'Content-Type': 'application/json',
      });

      expect(response.body).toBeNull();
    });

    test('should return an empty array if no accounts for the customer', async () => {
      const event = {
        requestContext: {
          authorizer: {
            jwt: { claims: { sub: mockUserId } },
          },
        },
        pathParameters: {
          customerId: '1',
        },
      };
      const response = await handler(event);

      expect(response.statusCode).toEqual(200);
      expect(response.headers).toEqual({
        'Content-Type': 'application/json',
      });
      expect(JSON.parse(response.body)).toEqual([]);
    });

    test('should return an array of all accounts for the user provided customer', async () => {
      const event = {
        requestContext: {
          authorizer: { jwt: { claims: { sub: mockUserId } } },
        },
        pathParameters: {
          customerId: '2',
        },
      };
      const response = await handler(event);

      expect(response.statusCode).toEqual(200);
      expect(response.headers).toEqual({
        'Content-Type': 'application/json',
      });

      const parsedResponse = JSON.parse(response.body);

      for (const account of [mockAccounts[0], mockAccounts[1]]) {
        expect(parsedResponse).toContainEqual({
          balance: account.balance,
          accountType: account.accountType,
          customerId: account.customerId,
          accountId: account.accountId,
        });
      }
    });
  });

  describe('get account by ID', () => {
    test('should return 404 if the account ID does not exist for the user', async () => {
      const event = {
        requestContext: {
          authorizer: { jwt: { claims: { sub: mockUserId } } },
        },
        pathParameters: {
          accountId: '999',
        },
      };
      const response = await handler(event);

      expect(response.statusCode).toEqual(404);
      expect(response.headers).toEqual({
        'Content-Type': 'application/json',
      });

      expect(response.body).toBeNull();
    });

    test('should return the requested account if the ID exists', async () => {
      const event = {
        requestContext: {
          authorizer: { jwt: { claims: { sub: mockUserId } } },
        },
        pathParameters: {
          accountId: '8',
        },
      };
      const response = await handler(event);

      expect(response.statusCode).toEqual(200);
      expect(response.headers).toEqual({
        'Content-Type': 'application/json',
      });

      const parsedResponse = JSON.parse(response.body);

      expect(parsedResponse).toEqual({
        balance: 12.34,
        accountType: 'Savings',
        customerId: '2',
        accountId: '8',
      });
    });
  });
});
