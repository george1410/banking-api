import { handler } from '../../../src/functions/getTransactions/handler';
import insertMockAccounts from '../utils/insertMockAccounts';
import insertMockCustomers from '../utils/insertMockCustomers';
import insertMockTransactions, {
  mockTransactions,
} from '../utils/insertMockTransactions';

const mockUserId = 'mock-user-1234';

beforeEach(async () => {
  await insertMockCustomers();
  await insertMockAccounts();
  await insertMockTransactions();
});

describe('Get Transactions', () => {
  describe('get transaction by ID', () => {
    test('should return 404 if the transaction ID does not exist for the user', async () => {
      const event = {
        requestContext: {
          authorizer: { jwt: { claims: { sub: mockUserId } } },
        },
        pathParameters: {
          transactionId: '445566',
        },
      };
      const response = await handler(event);

      expect(response.statusCode).toEqual(404);
      expect(response.headers).toEqual({
        'Content-Type': 'application/json',
      });

      expect(response.body).toBeNull();
    });

    test('should return the requested transaction if the ID exists', async () => {
      const event = {
        requestContext: {
          authorizer: { jwt: { claims: { sub: mockUserId } } },
        },
        pathParameters: {
          transactionId: '5555',
        },
      };
      const response = await handler(event);

      expect(response.statusCode).toEqual(200);
      expect(response.headers).toEqual({
        'Content-Type': 'application/json',
      });

      const parsedResponse = JSON.parse(response.body);

      expect(parsedResponse).toEqual({
        accountId: '9',
        transactionId: '5555',
        amount: 12.34,
        transactionDate: '2021-10-23T14:50:36.459Z',
        merchant: 'ASDA',
        category: 'Groceries',
      });
    });
  });

  describe('get all transactions for an account', () => {
    test('should return 404 if the account ID does not exist', async () => {
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

    test('should return an empty array if no transactions for the account', async () => {
      const event = {
        requestContext: {
          authorizer: {
            jwt: { claims: { sub: mockUserId } },
          },
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
      expect(JSON.parse(response.body)).toEqual([]);
    });

    test('should return an array of all transactions for the user provided account', async () => {
      const event = {
        requestContext: {
          authorizer: {
            jwt: { claims: { sub: mockUserId } },
          },
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

      const parsedResponse = JSON.parse(response.body);

      for (const transaction of [mockTransactions[0], mockTransactions[1]]) {
        expect(parsedResponse).toContainEqual({
          transactionId: transaction.transactionId,
          accountId: transaction.accountId,
          amount: transaction.amount,
          transactionDate: transaction.transactionDate,
          merchant: transaction.merchant,
          category: transaction.category,
        });
      }
    });
  });
});
