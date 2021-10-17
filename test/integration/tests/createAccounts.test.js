import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import ddbClient from '../../../src/database/common/ddbClient';
import { handler } from '../../../src/functions/createAccounts/handler';

const accountAllCustomFields = {
  accountType: 'Current',
  balance: 12.34,
};
const accountSomeCustomFields = {
  accountType: 'Savings',
};

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

const insertMockCustomers = async () => {
  const params = {
    RequestItems: {
      'banking-api': [
        {
          PutRequest: {
            Item: mockCustomers[0],
          },
        },
        {
          PutRequest: {
            Item: mockCustomers[1],
          },
        },
      ],
    },
  };
  await ddbClient.send(new BatchWriteCommand(params));
};

beforeEach(async () => {
  await insertMockCustomers();
});

describe('Create Accounts', () => {
  test('should respond with 404 status code if the customer to create an account for does not exist', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: mockUserId } } },
      },
      pathParameters: { customerId: '999' },
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(404);
  });

  test('should create a single account for the customer if no quantity or body provided', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: mockUserId } } },
      },
      pathParameters: { customerId: '1' },
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(201);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(response.body)).toEqual([
      {
        accountType: expect.any(String),
        balance: 0,
        customerId: '1',
        accountId: expect.any(String),
      },
    ]);
  });

  test('should create a the requested number of accounts for the customer if quantity is provided but no body', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: mockUserId } } },
      },
      pathParameters: { customerId: '1' },
      queryStringParameters: { quantity: 5 },
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(201);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });

    const parsedBody = JSON.parse(response.body);
    expect(parsedBody).toHaveLength(5);

    for (const account of parsedBody) {
      expect(account).toEqual({
        accountType: expect.any(String),
        balance: 0,
        customerId: '1',
        accountId: expect.any(String),
      });
    }
  });

  test('should create a single account for the customer with custom data if provided', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: mockUserId } } },
      },
      pathParameters: { customerId: '1' },
      body: JSON.stringify([accountAllCustomFields]),
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(201);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(response.body)).toEqual([
      {
        ...accountAllCustomFields,
        customerId: '1',
        accountId: expect.any(String),
      },
    ]);
  });

  test('should create multiple accounts for the customer with custom data if provided', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: mockUserId } } },
      },
      pathParameters: { customerId: '1' },
      body: JSON.stringify([accountAllCustomFields, accountSomeCustomFields]),
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(201);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(response.body)).toEqual([
      {
        ...accountAllCustomFields,
        customerId: '1',
        accountId: expect.any(String),
      },
      {
        ...accountSomeCustomFields,
        balance: expect.any(Number),
        customerId: '1',
        accountId: expect.any(String),
      },
    ]);
  });

  test('should respond with 400 status code if the request body is invalid', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: 'mock-user-1234' } } },
      },
      pathParameters: { customerId: '1' },
      body: JSON.stringify([{ accountType: 'Netflix' }]),
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(response.body)).toEqual({
      error: {
        message: 'Invalid request body',
        details: ['[0].accountType must be one of [Current, Savings]'],
      },
    });
  });

  test('should respond with 400 status code if the request body is malformed json', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: 'mock-user-1234' } } },
      },
      pathParameters: { customerId: '1' },
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
        authorizer: { jwt: { claims: { sub: 'mock-user-1234' } } },
      },
      pathParameters: { customerId: '1' },
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
