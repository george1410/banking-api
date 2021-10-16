import currency from 'currency.js';
import generateAccounts from './generateAccounts';

const randomSpy = jest.spyOn(global.Math, 'random');

describe('Generate accounts', () => {
  describe('when no custom data provided', () => {
    describe('when no quantity provided', () => {
      test('should generate 1 account', () => {
        const accounts = generateAccounts(null);
        expect(accounts).toHaveLength(1);
      });

      test('should generate 1 account with random accountType', () => {
        randomSpy.mockReturnValue(0.0);

        const accounts = generateAccounts(null);
        expect(accounts[0]).toHaveProperty('accountType', 'Current');

        randomSpy.mockReturnValue(0.99);

        const moreAccounts = generateAccounts(null);
        expect(moreAccounts[0]).toHaveProperty('accountType', 'Savings');
      });

      test('should generate 1 account with zero balance', () => {
        const accounts = generateAccounts(null);
        expect(accounts[0]).toHaveProperty('balance', currency(0.0));
      });
    });

    describe('when quantity provided', () => {
      test('should generate the desired number of accounts', () => {
        const accounts = generateAccounts(null, 2);
        expect(accounts).toHaveLength(2);

        const moreAccounts = generateAccounts(null, 5);
        expect(moreAccounts).toHaveLength(5);
      });

      test('should generate the desired number of accounts with random accountTypes', () => {
        randomSpy.mockReturnValueOnce(0.0);
        randomSpy.mockReturnValueOnce(0.99);

        const accounts = generateAccounts(null, 2);
        expect(accounts[0]).toHaveProperty('accountType', 'Current');
        expect(accounts[1]).toHaveProperty('accountType', 'Savings');
      });

      test('should generate the desired number of accounts with zero balances', () => {
        const accounts = generateAccounts(null, 2);
        expect(accounts[0]).toHaveProperty('balance', currency(0.0));
        expect(accounts[1]).toHaveProperty('balance', currency(0.0));
      });
    });
  });

  describe('when custom data is provided', () => {
    describe('when no quantity provided', () => {
      test('should generate the number of accounts specified by the input length', () => {
        const customData3Items = [{}, {}, {}];
        const threeAccounts = generateAccounts(customData3Items);
        expect(threeAccounts).toHaveLength(3);

        const customData2Items = [{}, {}];
        const twoAccounts = generateAccounts(customData2Items);
        expect(twoAccounts).toHaveLength(2);
      });

      test('should randomise accountType if not provided', () => {
        randomSpy.mockReturnValueOnce(0.99);
        randomSpy.mockReturnValueOnce(0.0);

        const customData2Items = [{ balance: 22.22 }, { balance: 34.56 }];
        const accounts = generateAccounts(customData2Items);
        expect(accounts[0]).toHaveProperty('accountType', 'Savings');
        expect(accounts[1]).toHaveProperty('accountType', 'Current');
      });

      test('should use provided accountTypes if provided', () => {
        randomSpy.mockReturnValue(0.99);

        const customData2Items = [
          { accountType: 'Current' },
          { accountType: 'Current' },
        ];
        const accounts = generateAccounts(customData2Items);
        expect(accounts[0]).toHaveProperty('accountType', 'Current');
        expect(accounts[1]).toHaveProperty('accountType', 'Current');
      });

      test('should set balances to zero if not provided', () => {
        const customData2Items = [
          { accountType: 'Current' },
          { accountType: 'Current' },
        ];

        const accounts = generateAccounts(customData2Items);
        expect(accounts[0]).toHaveProperty('balance', currency(0.0));
        expect(accounts[1]).toHaveProperty('balance', currency(0.0));
      });

      test('should use provided balances if provided', () => {
        const customData2Items = [{ balance: 123.45 }, { balance: 987.65 }];
        const accounts = generateAccounts(customData2Items);
        expect(accounts[0]).toHaveProperty('balance', currency(123.45));
        expect(accounts[1]).toHaveProperty('balance', currency(987.65));
      });
    });

    describe('when quantity provided', () => {
      test('should ignore the quantity if it is greater than the custom data length', () => {
        const customData3Items = [{}, {}, {}];
        const threeAccounts = generateAccounts(customData3Items, 5);
        expect(threeAccounts).toHaveLength(3);
      });

      test('should ignore the quantity if it is less than the custom data length', () => {
        const customData3Items = [{}, {}, {}];
        const threeAccounts = generateAccounts(customData3Items, 2);
        expect(threeAccounts).toHaveLength(3);
      });
    });
  });
});
