import axios from 'axios';
import generateTransactions from './generateTransactions';
import randomCompanies from '../../../test/unit/mockData/randomCompanies.json';
import currency from 'currency.js';

const randomSpy = jest.spyOn(global.Math, 'random');

jest.mock('axios');

axios.get.mockImplementation(async (url, options) => {
  const quantity = options.params.size;
  return {
    data: randomCompanies.slice(0, quantity),
  };
});

describe('Generate transactions', () => {
  describe('when no custom data provided', () => {
    describe('when no quantity provided', () => {
      test('should generate 1 transaction', async () => {
        const transactions = await generateTransactions(null);
        expect(transactions).toHaveLength(1);
      });

      test('should make a request to the random data api', async () => {
        await generateTransactions(null);
        expect(axios.get).toHaveBeenCalledWith(
          'https://random-data-api.com/api/company/random_company',
          {
            params: {
              size: 1,
            },
          }
        );
      });

      test('should generate 1 transaction with merchant from api response', async () => {
        const transactions = await generateTransactions(null);
        expect(transactions[0]).toHaveProperty(
          'merchant',
          randomCompanies[0].business_name
        );
      });

      test('should generate 1 transaction with category from api response', async () => {
        const transactions = await generateTransactions(null);
        expect(transactions[0]).toHaveProperty(
          'category',
          randomCompanies[0].industry
        );
      });

      test('should generate 1 transaction with random negative amount', async () => {
        randomSpy.mockReturnValue(0.5938161);

        const transactions = await generateTransactions(null);
        expect(transactions[0]).toHaveProperty('amount', currency(-593.82));
      });

      test.todo('should generate 1 transaction with current date');
    });

    describe('when quantity provided', () => {
      test('should make a request to the random data api', async () => {
        await generateTransactions(null, 5);
        expect(axios.get).toHaveBeenCalledWith(
          'https://random-data-api.com/api/company/random_company',
          {
            params: {
              size: 5,
            },
          }
        );
      });

      test('should generate the desired number of transactions', async () => {
        const transactions = await generateTransactions(null, 2);
        expect(transactions).toHaveLength(2);

        const moreTransactions = await generateTransactions(null, 5);
        expect(moreTransactions).toHaveLength(5);
      });

      test('should generate the desired number of transactions with merchant from api response', async () => {
        const transactions = await generateTransactions(null, 2);
        expect(transactions[0]).toHaveProperty(
          'merchant',
          randomCompanies[0].business_name
        );
        expect(transactions[1]).toHaveProperty(
          'merchant',
          randomCompanies[1].business_name
        );
      });

      test('should generate the desired number of transactions with category from api response', async () => {
        const transactions = await generateTransactions(null, 2);
        expect(transactions[0]).toHaveProperty(
          'category',
          randomCompanies[0].industry
        );
        expect(transactions[1]).toHaveProperty(
          'category',
          randomCompanies[1].industry
        );
      });

      test('should generate the desired number of transactions with random negative amount', async () => {
        randomSpy.mockReturnValueOnce(0.9876543);
        randomSpy.mockReturnValueOnce(0.1234567);

        const transactions = await generateTransactions(null, 2);
        expect(transactions[0]).toHaveProperty('amount', currency(-987.65));
        expect(transactions[1]).toHaveProperty('amount', currency(-123.46));
      });

      test.todo(
        'should generate the desired number of transactions with current date'
      );
    });
  });

  describe('when custom data is provided', () => {
    describe('when no quantity provided', () => {
      test('should make a request to the random data api', async () => {
        await generateTransactions([{}, {}, {}]);
        expect(axios.get).toHaveBeenCalledWith(
          'https://random-data-api.com/api/company/random_company',
          {
            params: {
              size: 3,
            },
          }
        );
      });

      test('should generate the number of transactions specified by the input length', async () => {
        const customData3Items = [{}, {}, {}];
        const threeTransactions = await generateTransactions(customData3Items);
        expect(threeTransactions).toHaveLength(3);

        const customData2Items = [{}, {}];
        const twoTransactions = await generateTransactions(customData2Items);
        expect(twoTransactions).toHaveLength(2);
      });

      test('should randomise merchant if not provided', async () => {
        const customData2Items = [{}, {}];
        const transactions = await generateTransactions(customData2Items);
        expect(transactions[0]).toHaveProperty(
          'merchant',
          randomCompanies[0].business_name
        );
        expect(transactions[1]).toHaveProperty(
          'merchant',
          randomCompanies[1].business_name
        );
      });

      test('should use provided merchant if provided', async () => {
        randomSpy.mockReturnValue(0.99);

        const customData2Items = [
          { merchant: 'ASDA' },
          { merchant: 'Sainsburys' },
        ];
        const transactions = await generateTransactions(customData2Items);
        expect(transactions[0]).toHaveProperty('merchant', 'ASDA');
        expect(transactions[1]).toHaveProperty('merchant', 'Sainsburys');
      });

      test('should randomise category if not provided', async () => {
        const customData2Items = [{}, {}];
        const transactions = await generateTransactions(customData2Items);
        expect(transactions[0]).toHaveProperty(
          'category',
          randomCompanies[0].industry
        );
        expect(transactions[1]).toHaveProperty(
          'category',
          randomCompanies[1].industry
        );
      });

      test('should use provided category if provided', async () => {
        const customData2Items = [
          { category: 'Groceries' },
          { category: 'Electricals' },
        ];
        const transactions = await generateTransactions(customData2Items);
        expect(transactions[0]).toHaveProperty('category', 'Groceries');
        expect(transactions[1]).toHaveProperty('category', 'Electricals');
      });

      test('should randomise amount if not provided', async () => {
        randomSpy.mockReturnValueOnce(0.9876543);
        randomSpy.mockReturnValueOnce(0.1234567);

        const customData2Items = [{}, {}];
        const transactions = await generateTransactions(customData2Items);
        expect(transactions[0]).toHaveProperty('amount', currency(-987.65));
        expect(transactions[1]).toHaveProperty('amount', currency(-123.46));
      });

      test('should use provided amount if provided', async () => {
        randomSpy.mockReturnValueOnce(0.9876543);
        randomSpy.mockReturnValueOnce(0.1234567);

        const customData2Items = [{ amount: 432 }, { amount: 767.65 }];
        const transactions = await generateTransactions(customData2Items);
        expect(transactions[0]).toHaveProperty('amount', currency(432.0));
        expect(transactions[1]).toHaveProperty('amount', currency(767.65));
      });

      test.todo('should randomise transactionDate if not provided');

      test('should use provided transactionDate if provided', async () => {
        const customData2Items = [
          { transactionDate: '2021-10-16T17:45:32.049Z' },
          { transactionDate: '202-25-12T09:30:15.123' },
        ];
        const transactions = await generateTransactions(customData2Items);
        expect(transactions[0]).toHaveProperty(
          'transactionDate',
          '2021-10-16T17:45:32.049Z'
        );
        expect(transactions[1]).toHaveProperty(
          'transactionDate',
          '202-25-12T09:30:15.123'
        );
      });
    });

    describe('when quantity provided', () => {
      const customData3Items = [{}, {}, {}];

      test('should make a request to the random data api', async () => {
        await generateTransactions(customData3Items, 5);
        expect(axios.get).toHaveBeenCalledWith(
          'https://random-data-api.com/api/company/random_company',
          {
            params: {
              size: 3,
            },
          }
        );
      });

      test('should ignore the quantity if it is greater than the custom data length', async () => {
        const threeTransactions = await generateTransactions(
          customData3Items,
          5
        );
        expect(threeTransactions).toHaveLength(3);
      });

      test('should ignore the quantity if it is less than the custom data length', async () => {
        const threeTransactions = await generateTransactions(
          customData3Items,
          2
        );
        expect(threeTransactions).toHaveLength(3);
      });
    });
  });
});
