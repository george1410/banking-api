import { handler } from '../../../src/functions/deleteAccounts/handler';
import insertMockAccounts from '../utils/insertMockAccounts';
import insertMockCustomers from '../utils/insertMockCustomers';

const mockUserId = 'mock-user-1234';

beforeEach(async () => {
  await insertMockCustomers();
  await insertMockAccounts();
});

describe('Delete Accounts', () => {
  describe('delete account by ID', () => {
    test('should return 404 if the account ID does not exist', async () => {
      const event = {
        requestContext: {
          authorizer: { jwt: { claims: { sub: mockUserId } } },
        },
        pathParameters: {
          accountId: '123',
        },
      };
      const response = await handler(event);

      expect(response.statusCode).toEqual(404);
      expect(response.headers).toEqual({
        'Content-Type': 'application/json',
      });

      expect(response.body).toBeNull();
    });

    test('should return 200 if the account is deleted successfully', async () => {
      const event = {
        requestContext: {
          authorizer: { jwt: { claims: { sub: mockUserId } } },
        },
        pathParameters: {
          accountId: '9',
        },
      };
      const response = await handler(event);

      expect(response.statusCode).toEqual(200);
      expect(response.headers).toEqual({
        'Content-Type': 'application/json',
      });

      expect(response.body).toBeNull();
    });
  });

  describe('delete all accounts for a customer', () => {
    test('should return 404 if the customer ID does not exist', async () => {
      const event = {
        requestContext: {
          authorizer: { jwt: { claims: { sub: mockUserId } } },
        },
        pathParameters: {
          customerId: '98765',
        },
      };
      const response = await handler(event);

      expect(response.statusCode).toEqual(404);
      expect(response.headers).toEqual({
        'Content-Type': 'application/json',
      });

      expect(response.body).toBeNull();
    });

    test('should return 200 if the accounts are deleted successfully', async () => {
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

      expect(response.body).toBeNull();
    });
  });
});
