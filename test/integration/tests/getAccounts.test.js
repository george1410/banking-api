import { handler } from '../../../src/functions/getAccounts/handler';
import insertMockAccounts, { mockAccounts } from '../utils/insertMockAccounts';
import insertMockCustomers from '../utils/insertMockCustomers';

const mockUserId = 'mock-user-1234';

beforeEach(async () => {
  await insertMockCustomers();
  await insertMockAccounts();
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
