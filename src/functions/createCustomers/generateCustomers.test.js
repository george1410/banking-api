import generateCustomers from './generateCustomers';
import randomUsers from '../../../test/unit/mockData/randomUsers.json';
import axios from 'axios';

jest.mock('axios');

axios.get.mockImplementation(async (url, options) => {
  const quantity = options.params.size;
  return {
    data: randomUsers.slice(0, quantity),
  };
});

describe('Generate customers', () => {
  describe('when no custom data provided', () => {
    test('should generate 1 customer', async () => {
      const customers = await generateCustomers(null);
      expect(customers).toHaveLength(1);
    });

    test('should make a request to the random data api', async () => {
      await generateCustomers(null);
      expect(axios.get).toHaveBeenCalledWith(
        'https://random-data-api.com/api/users/random_user',
        {
          params: {
            size: 1,
          },
        }
      );
    });

    test('should generate 1 customer with firstName from api response', async () => {
      const customers = await generateCustomers(null);
      expect(customers[0]).toHaveProperty(
        'firstName',
        randomUsers[0].first_name
      );
    });

    test('should generate 1 customer with lastName from api response', async () => {
      const customers = await generateCustomers(null);
      expect(customers[0]).toHaveProperty('lastName', randomUsers[0].last_name);
    });

    test('should generate 1 customer with email from api response', async () => {
      const customers = await generateCustomers(null);
      expect(customers[0]).toHaveProperty('email', randomUsers[0].email);
    });

    test('should generate 1 customer with address from api response', async () => {
      const customers = await generateCustomers(null);
      expect(customers[0]).toHaveProperty('address', {
        streetAddress: randomUsers[0].address.street_address,
        city: randomUsers[0].address.city,
        state: randomUsers[0].address.state,
        zipCode: randomUsers[0].address.zip_code,
        country: randomUsers[0].address.country,
      });
    });
  });

  describe('when quantity provided', () => {
    test('should make a request to the random data api', async () => {
      await generateCustomers(null, 5);
      expect(axios.get).toHaveBeenCalledWith(
        'https://random-data-api.com/api/users/random_user',
        {
          params: {
            size: 5,
          },
        }
      );
    });

    test('should generate the desired number of customers', async () => {
      const customers = await generateCustomers(null, 2);
      expect(customers).toHaveLength(2);

      const moreCustomers = await generateCustomers(null, 5);
      expect(moreCustomers).toHaveLength(5);
    });

    test('should generate the desired number of customers with firstName from api response', async () => {
      const customers = await generateCustomers(null, 2);
      expect(customers[0]).toHaveProperty(
        'firstName',
        randomUsers[0].first_name
      );
      expect(customers[1]).toHaveProperty(
        'firstName',
        randomUsers[1].first_name
      );
    });

    test('should generate the desired number of customers with lastName from api response', async () => {
      const customers = await generateCustomers(null, 2);
      expect(customers[0]).toHaveProperty('lastName', randomUsers[0].last_name);
      expect(customers[1]).toHaveProperty('lastName', randomUsers[1].last_name);
    });

    test('should generate the desired number of customers with email from api response', async () => {
      const customers = await generateCustomers(null, 2);
      expect(customers[0]).toHaveProperty('email', randomUsers[0].email);
      expect(customers[1]).toHaveProperty('email', randomUsers[1].email);
    });

    test('should generate the desired number of customers with address from api response', async () => {
      const customers = await generateCustomers(null, 2);
      expect(customers[0]).toHaveProperty('address', {
        streetAddress: randomUsers[0].address.street_address,
        city: randomUsers[0].address.city,
        state: randomUsers[0].address.state,
        zipCode: randomUsers[0].address.zip_code,
        country: randomUsers[0].address.country,
      });
      expect(customers[1]).toHaveProperty('address', {
        streetAddress: randomUsers[1].address.street_address,
        city: randomUsers[1].address.city,
        state: randomUsers[1].address.state,
        zipCode: randomUsers[1].address.zip_code,
        country: randomUsers[1].address.country,
      });
    });
  });

  describe('when custom data is provided', () => {
    describe('when no quantity provided', () => {
      test('should make a request to the random data api', async () => {
        await generateCustomers([{}, {}, {}]);
        expect(axios.get).toHaveBeenCalledWith(
          'https://random-data-api.com/api/users/random_user',
          {
            params: {
              size: 3,
            },
          }
        );
      });

      test('should generate the number of transactions specified by the input length', async () => {
        const customData3Items = [{}, {}, {}];
        const threeTransactions = await generateCustomers(customData3Items);
        expect(threeTransactions).toHaveLength(3);

        const customData2Items = [{}, {}];
        const twoTransactions = await generateCustomers(customData2Items);
        expect(twoTransactions).toHaveLength(2);
      });

      test('should randomise firstName if not provided', async () => {
        const customData2Items = [{}, {}];
        const customers = await generateCustomers(customData2Items);
        expect(customers[0]).toHaveProperty(
          'firstName',
          randomUsers[0].first_name
        );
        expect(customers[1]).toHaveProperty(
          'firstName',
          randomUsers[1].first_name
        );
      });

      test('should randomise lastName if not provided', async () => {
        const customData2Items = [{}, {}];
        const customers = await generateCustomers(customData2Items);
        expect(customers[0]).toHaveProperty(
          'lastName',
          randomUsers[0].last_name
        );
        expect(customers[1]).toHaveProperty(
          'lastName',
          randomUsers[1].last_name
        );
      });

      test('should randomise email if not provided', async () => {
        const customData2Items = [{}, {}];
        const customers = await generateCustomers(customData2Items);
        expect(customers[0]).toHaveProperty('email', randomUsers[0].email);
        expect(customers[1]).toHaveProperty('email', randomUsers[1].email);
      });

      test('should randomise address if not provided or if parts missing', async () => {
        const customData2Items = [{}, { address: {} }];
        const customers = await generateCustomers(customData2Items);
        expect(customers[0]).toHaveProperty('address', {
          streetAddress: randomUsers[0].address.street_address,
          city: randomUsers[0].address.city,
          state: randomUsers[0].address.state,
          zipCode: randomUsers[0].address.zip_code,
          country: randomUsers[0].address.country,
        });
        expect(customers[1]).toHaveProperty('address', {
          streetAddress: randomUsers[1].address.street_address,
          city: randomUsers[1].address.city,
          state: randomUsers[1].address.state,
          zipCode: randomUsers[1].address.zip_code,
          country: randomUsers[1].address.country,
        });
      });

      test('should use provided firstName if provided', async () => {
        const customData2Items = [
          { firstName: 'George' },
          { firstName: 'Bob' },
        ];
        const customers = await generateCustomers(customData2Items);
        expect(customers[0]).toHaveProperty('firstName', 'George');
        expect(customers[1]).toHaveProperty('firstName', 'Bob');
      });

      test('should use provided lastName if provided', async () => {
        const customData2Items = [
          { lastName: 'McCarron' },
          { lastName: 'Smith' },
        ];
        const customers = await generateCustomers(customData2Items);
        expect(customers[0]).toHaveProperty('lastName', 'McCarron');
        expect(customers[1]).toHaveProperty('lastName', 'Smith');
      });

      test('should use provided email if provided', async () => {
        const customData2Items = [
          { email: 'hello@georgemccarron.com' },
          { email: 'bob@example.com' },
        ];
        const customers = await generateCustomers(customData2Items);
        expect(customers[0]).toHaveProperty(
          'email',
          'hello@georgemccarron.com'
        );
        expect(customers[1]).toHaveProperty('email', 'bob@example.com');
      });

      test('should use provided address elements if provided', async () => {
        const customData2Items = [
          {
            address: {
              streetAddress: '123 Some Street',
              city: 'MyCity',
              state: 'MyState',
              zipCode: '12345',
              country: 'UK',
            },
          },
          { address: { city: 'London', country: 'UK' } },
        ];
        const customers = await generateCustomers(customData2Items);
        expect(customers[0]).toHaveProperty('address', {
          streetAddress: '123 Some Street',
          city: 'MyCity',
          state: 'MyState',
          zipCode: '12345',
          country: 'UK',
        });
        expect(customers[1]).toHaveProperty('address', {
          streetAddress: randomUsers[1].address.street_address,
          city: 'London',
          state: randomUsers[1].address.state,
          zipCode: randomUsers[1].address.zip_code,
          country: 'UK',
        });
      });
    });

    describe('when quantity provided', () => {
      const customData3Items = [{}, {}, {}];

      test('should make a request to the random data api', async () => {
        await generateCustomers(customData3Items, 5);
        expect(axios.get).toHaveBeenCalledWith(
          'https://random-data-api.com/api/users/random_user',
          {
            params: {
              size: 3,
            },
          }
        );
      });

      test('should ignore the quantity if it is greater than the custom data length', async () => {
        const threeTransactions = await generateCustomers(customData3Items, 5);
        expect(threeTransactions).toHaveLength(3);
      });

      test('should ignore the quantity if it is less than the custom data length', async () => {
        const threeTransactions = await generateCustomers(customData3Items, 2);
        expect(threeTransactions).toHaveLength(3);
      });
    });
  });
});
