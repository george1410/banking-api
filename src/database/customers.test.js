import generateId from '../lib/generateId';
import fetchFromDatabase from './common/fetchFromDatabase';
import getByKey from './common/getByKey';
import writeToDatabase from './common/writeToDatabase';
import Customers from './customers';

jest.mock('./common/writeToDatabase');
jest.mock('./common/getByKey');
jest.mock('./common/fetchFromDatabase');
jest.mock('../lib/generateId');

const userId = 'usr123';

generateId.mockReturnValue('mockId');
getByKey.mockReturnValue({
  customerId: 'mockId1',
  PK: 'USER#usr123',
  SK: 'CUSTOMER#mockId1',
  firstName: 'George',
  lastName: 'McCarron',
  email: 'hello@georgemccarron.com',
  address: {
    streetAddress: '10 High Street',
    city: 'Dartford',
    state: 'Kent',
    zipCode: 'DA1 1AA',
    country: 'UK',
  },
});
fetchFromDatabase.mockReturnValue([
  {
    customerId: 'mockId1',
    PK: 'USER#usr123',
    SK: 'CUSTOMER#mockId1',
    firstName: 'George',
    lastName: 'McCarron',
    email: 'hello@georgemccarron.com',
    address: {
      streetAddress: '10 High Street',
      city: 'Dartford',
      state: 'Kent',
      zipCode: 'DA1 1AA',
      country: 'UK',
    },
  },
  {
    customerId: 'mockId2',
    PK: 'USER#usr123',
    SK: 'CUSTOMER#mockId2',
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    address: {
      streetAddress: '19 Some Street',
      city: 'Los Angeles',
      state: 'California',
      zipCode: '12345',
      country: 'United States',
    },
  },
]);

describe('Customers data layer', () => {
  describe('insert customers', () => {
    test('should write to database with customer data and internal attributes', async () => {
      const customerData = [
        {
          firstName: 'George',
          lastName: 'McCarron',
          email: 'hello@georgemccarron.com',
          address: {
            streetAddress: '10 High Street',
            city: 'Dartford',
            state: 'Kent',
            zipCode: 'DA1 1AA',
            country: 'UK',
          },
        },
        {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          address: {
            streetAddress: '19 Some Street',
            city: 'Los Angeles',
            state: 'California',
            zipCode: '12345',
            country: 'United States',
          },
        },
      ];
      await Customers(userId).insertCustomers(customerData);

      expect(writeToDatabase).toHaveBeenCalledWith([
        {
          customerId: 'mockId',
          PK: 'USER#usr123',
          SK: 'CUSTOMER#mockId',
          firstName: 'George',
          lastName: 'McCarron',
          email: 'hello@georgemccarron.com',
          address: {
            streetAddress: '10 High Street',
            city: 'Dartford',
            state: 'Kent',
            zipCode: 'DA1 1AA',
            country: 'UK',
          },
        },
        {
          customerId: 'mockId',
          PK: 'USER#usr123',
          SK: 'CUSTOMER#mockId',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          address: {
            streetAddress: '19 Some Street',
            city: 'Los Angeles',
            state: 'California',
            zipCode: '12345',
            country: 'United States',
          },
        },
      ]);
    });

    test('should return serializable customer data with IDs', async () => {
      const customerData = [
        {
          firstName: 'George',
          lastName: 'McCarron',
          email: 'hello@georgemccarron.com',
          address: {
            streetAddress: '10 High Street',
            city: 'Dartford',
            state: 'Kent',
            zipCode: 'DA1 1AA',
            country: 'UK',
          },
        },
        {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          address: {
            streetAddress: '19 Some Street',
            city: 'Los Angeles',
            state: 'California',
            zipCode: '12345',
            country: 'United States',
          },
        },
      ];
      const customers = await Customers(userId).insertCustomers(customerData);

      expect(customers).toEqual([
        {
          customerId: 'mockId',
          firstName: 'George',
          lastName: 'McCarron',
          email: 'hello@georgemccarron.com',
          address: {
            streetAddress: '10 High Street',
            city: 'Dartford',
            state: 'Kent',
            zipCode: 'DA1 1AA',
            country: 'UK',
          },
        },
        {
          customerId: 'mockId',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          address: {
            streetAddress: '19 Some Street',
            city: 'Los Angeles',
            state: 'California',
            zipCode: '12345',
            country: 'United States',
          },
        },
      ]);
    });
  });

  describe('get single customer', () => {
    test('should fetch from the database using the correct key', async () => {
      await Customers(userId).getCustomer('mockId1');
      expect(getByKey).toHaveBeenCalledWith('USER#usr123', 'CUSTOMER#mockId1');
    });

    test('should return serializable customer data with IDs', async () => {
      const customer = await Customers(userId).getCustomer('mockId1');

      expect(customer).toEqual({
        customerId: 'mockId1',
        firstName: 'George',
        lastName: 'McCarron',
        email: 'hello@georgemccarron.com',
        address: {
          streetAddress: '10 High Street',
          city: 'Dartford',
          state: 'Kent',
          zipCode: 'DA1 1AA',
          country: 'UK',
        },
      });
    });
  });

  describe('get all customers', () => {
    test('should fetch from the database using the correct query', async () => {
      await Customers(userId).getAllCustomers();
      expect(fetchFromDatabase).toHaveBeenCalledWith(
        'PK = :PK and begins_with(SK, :SK)',
        {
          ':PK': `USER#usr123`,
          ':SK': `CUSTOMER#`,
        }
      );
    });

    test('should return serializable customer data with IDs', async () => {
      const customer = await Customers(userId).getAllCustomers();

      expect(customer).toEqual([
        {
          customerId: 'mockId1',
          firstName: 'George',
          lastName: 'McCarron',
          email: 'hello@georgemccarron.com',
          address: {
            streetAddress: '10 High Street',
            city: 'Dartford',
            state: 'Kent',
            zipCode: 'DA1 1AA',
            country: 'UK',
          },
        },
        {
          customerId: 'mockId2',
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          address: {
            streetAddress: '19 Some Street',
            city: 'Los Angeles',
            state: 'California',
            zipCode: '12345',
            country: 'United States',
          },
        },
      ]);
    });
  });
});
