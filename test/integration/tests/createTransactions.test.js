import { handler } from '../../../src/functions/createTransactions/handler';
import insertMockAccounts from '../utils/insertMockAccounts';

const transactionAllCustomFields = {
  amount: 123.45,
  transactionDate: '2021-10-23T19:46:02.844Z',
  merchant: 'Capital One',
  category: 'Credit Cards',
};

const transactionSomeCustomFields = {
  merchant: 'Capital One',
  category: 'Credit Cards',
};

const mockUserId = 'mock-user-1234';

beforeEach(async () => {
  await insertMockAccounts();
});

describe('Create Transactions', () => {
  test('should respond with 404 status code if the account to create a transaction for does not exist', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: mockUserId } } },
      },
      pathParameters: { accountId: '999' },
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(404);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(response.body).toBeNull();
  });

  test('should create a single transaction for the account if no quantity of body provided', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: mockUserId } } },
      },
      pathParameters: { accountId: '9' },
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(201);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(response.body)).toEqual([
      {
        accountId: '9',
        transactionId: expect.any(String),
        amount: expect.any(Number),
        transactionDate: expect.any(String),
        merchant: expect.any(String),
        category: expect.any(String),
      },
    ]);
  });

  test('should create a the requested number of transactions for the account if quantity is provided but no body', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: mockUserId } } },
      },
      pathParameters: { accountId: '9' },
      queryStringParameters: { quantity: 4 },
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(201);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });

    const parsedBody = JSON.parse(response.body);
    expect(parsedBody).toHaveLength(4);

    for (const account of parsedBody) {
      expect(account).toEqual({
        accountId: '9',
        transactionId: expect.any(String),
        amount: expect.any(Number),
        transactionDate: expect.any(String),
        merchant: expect.any(String),
        category: expect.any(String),
      });
    }
  });

  test('should create a single account for the customer with custom data if provided', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: mockUserId } } },
      },
      pathParameters: { accountId: '9' },
      body: JSON.stringify([transactionAllCustomFields]),
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(201);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(response.body)).toEqual([
      {
        ...transactionAllCustomFields,
        accountId: '9',
        transactionId: expect.any(String),
      },
    ]);
  });

  test('should create a multiple transactions for the account with custom data if provided', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: mockUserId } } },
      },
      pathParameters: { accountId: '9' },
      body: JSON.stringify([
        transactionAllCustomFields,
        transactionSomeCustomFields,
      ]),
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(201);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(response.body)).toEqual([
      {
        ...transactionAllCustomFields,
        accountId: '9',
        transactionId: expect.any(String),
      },
      {
        ...transactionSomeCustomFields,
        amount: expect.any(Number),
        transactionDate: expect.any(String),
        accountId: '9',
        transactionId: expect.any(String),
      },
    ]);
  });

  test('should respond with 400 status code if the request body is invalid', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: mockUserId } } },
      },
      pathParameters: { accountId: '9' },
      body: JSON.stringify([{ accountId: '95842' }]),
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(response.body)).toEqual({
      error: {
        message: 'Invalid request body',
        details: [
          '[0].accountId is not allowed',
          '[0] must contain at least one of [merchant, category, amount, transactionDate]',
        ],
      },
    });
  });

  test('should respond with 400 status code if the request body is malformed json', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: mockUserId } } },
      },
      pathParameters: { accountId: '9' },
      body: `{"this", "bad"}`,
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(response.body)).toEqual({
      error: {
        message: 'Malformed JSON',
      },
    });
  });

  test('should respond with 400 status code if quantity is not a number', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: mockUserId } } },
      },
      pathParameters: { accountId: '9' },
      queryStringParameters: { quantity: 'hello' },
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(response.body)).toEqual({
      error: {
        message: 'Invalid quantity',
      },
    });
  });
});
