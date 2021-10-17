import { handler } from '../../../src/functions/createCustomers/handler';

const customerAllCustomFields = {
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
};

const customerSomeCustomFields = {
  firstName: 'John',
  lastName: 'Smith',
  address: {
    streetAddress: '10 Main Road',
    country: 'Spain',
  },
};

describe('Create Customers', () => {
  test('should create a single customer if no quantity or body provided', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: 'mock-user-1234' } } },
      },
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(201);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(response.body)).toEqual([
      {
        lastName: expect.any(String),
        address: {
          zipCode: expect.any(String),
          country: expect.any(String),
          state: expect.any(String),
          city: expect.any(String),
          streetAddress: expect.any(String),
        },
        email: expect.any(String),
        firstName: expect.any(String),
        customerId: expect.any(String),
      },
    ]);
  });

  test('should create the requested number of customers if quantity is provided, but no body', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: 'mock-user-1234' } } },
      },
      queryStringParameters: { quantity: 5 },
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(201);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });

    const parsedBody = JSON.parse(response.body);
    expect(parsedBody).toHaveLength(5);

    for (const customer of parsedBody) {
      expect(customer).toEqual({
        lastName: expect.any(String),
        address: {
          zipCode: expect.any(String),
          country: expect.any(String),
          state: expect.any(String),
          city: expect.any(String),
          streetAddress: expect.any(String),
        },
        email: expect.any(String),
        firstName: expect.any(String),
        customerId: expect.any(String),
      });
    }
  });

  test('should create a single customer with custom data if provided', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: 'mock-user-1234' } } },
      },
      body: JSON.stringify([customerAllCustomFields]),
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(201);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(response.body)).toEqual([
      {
        ...customerAllCustomFields,
        customerId: expect.any(String),
      },
    ]);
  });

  test('should create multiple customers with custom data if provided', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: 'mock-user-1234' } } },
      },
      body: JSON.stringify([customerAllCustomFields, customerSomeCustomFields]),
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(201);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(response.body)).toEqual([
      {
        ...customerAllCustomFields,
        customerId: expect.any(String),
      },
      {
        ...customerSomeCustomFields,
        email: expect.any(String),
        address: {
          ...customerSomeCustomFields.address,
          city: expect.any(String),
          state: expect.any(String),
          zipCode: expect.any(String),
        },
        customerId: expect.any(String),
      },
    ]);
  });

  test('should respond with 400 status code if the request body is invalid', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: 'mock-user-1234' } } },
      },
      body: JSON.stringify({ not: 'valid' }),
    };
    const response = await handler(event);

    expect(response.statusCode).toEqual(400);
    expect(response.headers).toEqual({
      'Content-Type': 'application/json',
    });
    expect(JSON.parse(response.body)).toEqual({
      error: {
        message: 'Invalid request body',
        details: ['Customers array must be an array'],
      },
    });
  });

  test('should respond with 400 status code if the request body is malformed json', async () => {
    const event = {
      requestContext: {
        authorizer: { jwt: { claims: { sub: 'mock-user-1234' } } },
      },
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
});
