import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import ddbClient from '../../../src/database/common/ddbClient';
import { handler } from '../../../src/functions/getCustomers/handler';

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

describe('Get Customers', () => {
  describe('get all customers', () => {
    test('should return an empty array if no customers for the user', async () => {
      const event = {
        requestContext: {
          authorizer: {
            jwt: { claims: { sub: 'user-id-with-no-customers' } },
          },
        },
      };
      const response = await handler(event);

      expect(response.statusCode).toEqual(200);
      expect(response.headers).toEqual({
        'Content-Type': 'application/json',
      });
      expect(JSON.parse(response.body)).toEqual([]);
    });

    test('should return an array of all customers for the authenticated user', async () => {
      const event = {
        requestContext: {
          authorizer: { jwt: { claims: { sub: mockUserId } } },
        },
      };
      const response = await handler(event);

      expect(response.statusCode).toEqual(200);
      expect(response.headers).toEqual({
        'Content-Type': 'application/json',
      });

      const parsedResponse = JSON.parse(response.body);

      for (const customer of [mockCustomers[0], mockCustomers[1]]) {
        expect(parsedResponse).toContainEqual({
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          address: customer.address,
          customerId: customer.customerId,
        });
      }
    });
  });

  describe('get customer by ID', () => {
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

      expect(response.body).toBe(undefined);
    });
  });

  test('should return the requested customer if the ID exists', async () => {
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

    expect(parsedResponse).toEqual({
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
      customerId: '2',
    });
  });
});
