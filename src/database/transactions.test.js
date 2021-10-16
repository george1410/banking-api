import currency from 'currency.js';
import generateId from '../lib/generateId';
import deleteFromDatabase from './common/deleteFromDatabase';
import fetchFromDatabase from './common/fetchFromDatabase';
import getByKey from './common/getByKey';
import writeToDatabase from './common/writeToDatabase';
import Transactions from './transactions';

const mockUpdateBalance = jest.fn();

jest.mock('./common/writeToDatabase');
jest.mock('./common/getByKey');
jest.mock('./common/fetchFromDatabase');
jest.mock('./common/deleteFromDatabase');
jest.mock('./accounts', () => () => ({
  updateBalance: mockUpdateBalance,
}));
jest.mock('../lib/generateId');

const userId = 'usr123';
const accountId = 'acct999';

generateId.mockReturnValue('mockId');
getByKey.mockReturnValue({
  accountId,
  transactionId: 'mockId1',
  PK: 'USER#usr123',
  SK: 'TRANSACTION#mockId1',
  GSI1PK: 'USER#usr123#ACCOUNT#acct999',
  GSI1SK: 'TRANSACTION#2021-10-16T20:55:39.656Z',
  merchant: 'ASDA',
  category: 'Groceries',
  amount: -20.5,
  transactionDate: '2021-10-16T20:55:39.656Z',
});
fetchFromDatabase.mockReturnValue([
  {
    accountId,
    transactionId: 'mockId1',
    PK: 'USER#usr123',
    SK: 'TRANSACTION#mockId1',
    GSI1PK: 'USER#usr123#ACCOUNT#acct999',
    GSI1SK: 'TRANSACTION#2021-10-16T20:55:39.656Z',
    merchant: 'ASDA',
    category: 'Groceries',
    amount: -20.5,
    transactionDate: '2021-10-16T20:55:39.656Z',
  },
  {
    accountId,
    transactionId: 'mockId2',
    PK: 'USER#usr123',
    SK: 'TRANSACTION#mockId2',
    GSI1PK: 'USER#usr123#ACCOUNT#acct999',
    GSI1SK: 'TRANSACTION#2021-10-16T20:55:39.656Z',
    merchant: 'B&Q',
    category: 'DIY',
    amount: 10,
    transactionDate: '2021-10-16T20:55:39.656Z',
  },
]);

describe('Transactions data layer', () => {
  describe('insert transactions', () => {
    test('should write to database with account data and internal attributes', async () => {
      const transactionData = [
        {
          merchant: 'ASDA',
          category: 'Groceries',
          amount: currency(-20.5),
          transactionDate: '2021-10-16T20:55:39.656Z',
        },
        {
          merchant: 'B&Q',
          category: 'DIY',
          amount: currency(10),
          transactionDate: '2021-10-16T20:55:39.656Z',
        },
      ];
      await Transactions(userId).insertTransactions(accountId, transactionData);

      expect(writeToDatabase).toHaveBeenCalledWith([
        {
          accountId,
          transactionId: 'mockId',
          PK: 'USER#usr123',
          SK: 'TRANSACTION#mockId',
          GSI1PK: 'USER#usr123#ACCOUNT#acct999',
          GSI1SK: 'TRANSACTION#2021-10-16T20:55:39.656Z',
          merchant: 'ASDA',
          category: 'Groceries',
          amount: -20.5,
          transactionDate: '2021-10-16T20:55:39.656Z',
        },
        {
          accountId,
          transactionId: 'mockId',
          PK: 'USER#usr123',
          SK: 'TRANSACTION#mockId',
          GSI1PK: 'USER#usr123#ACCOUNT#acct999',
          GSI1SK: 'TRANSACTION#2021-10-16T20:55:39.656Z',
          merchant: 'B&Q',
          category: 'DIY',
          amount: 10,
          transactionDate: '2021-10-16T20:55:39.656Z',
        },
      ]);
    });

    test('should return serializable account data with IDs', async () => {
      const transactionData = [
        {
          merchant: 'ASDA',
          category: 'Groceries',
          amount: currency(-20.5),
          transactionDate: '2021-10-16T20:55:39.656Z',
        },
        {
          merchant: 'B&Q',
          category: 'DIY',
          amount: currency(10),
          transactionDate: '2021-10-16T20:55:39.656Z',
        },
      ];
      const transactions = await Transactions(userId).insertTransactions(
        accountId,
        transactionData
      );

      expect(transactions).toEqual([
        {
          accountId,
          transactionId: 'mockId',
          merchant: 'ASDA',
          category: 'Groceries',
          amount: -20.5,
          transactionDate: '2021-10-16T20:55:39.656Z',
        },
        {
          accountId,
          transactionId: 'mockId',
          merchant: 'B&Q',
          category: 'DIY',
          amount: 10,
          transactionDate: '2021-10-16T20:55:39.656Z',
        },
      ]);
    });

    test('should update the account balance by the sum of the new transactions', async () => {
      const transactionData = [
        {
          merchant: 'ASDA',
          category: 'Groceries',
          amount: currency(-20.5),
          transactionDate: '2021-10-16T20:55:39.656Z',
        },
        {
          merchant: 'B&Q',
          category: 'DIY',
          amount: currency(10),
          transactionDate: '2021-10-16T20:55:39.656Z',
        },
      ];
      const transactions = await Transactions(userId).insertTransactions(
        accountId,
        transactionData
      );

      expect(mockUpdateBalance).toHaveBeenCalledWith(
        accountId,
        currency(-10.5)
      );
    });
  });

  describe('get single transaction', () => {
    test('should fetch from the database using the correct key', async () => {
      await Transactions(userId).getTransaction('mockId1');
      expect(getByKey).toHaveBeenCalledWith(
        'USER#usr123',
        'TRANSACTION#mockId1'
      );
    });

    test('should return serializable transaction data with IDs', async () => {
      const transaction = await Transactions(userId).getTransaction('mockId1');

      expect(transaction).toEqual({
        accountId,
        transactionId: 'mockId1',
        merchant: 'ASDA',
        category: 'Groceries',
        amount: -20.5,
        transactionDate: '2021-10-16T20:55:39.656Z',
      });
    });
  });

  describe('get all transactions for account', () => {
    test('should fetch from the database using the correct query', async () => {
      await Transactions(userId).getAllTransactions(accountId);
      expect(fetchFromDatabase).toHaveBeenCalledWith(
        'GSI1PK = :PK and begins_with(GSI1SK, :SK)',
        {
          ':PK': `USER#usr123#ACCOUNT#acct999`,
          ':SK': `TRANSACTION#`,
        },
        'GSI1'
      );
    });

    test('should return serializable account data with IDs', async () => {
      const transactions = await Transactions(userId).getAllTransactions(
        accountId
      );

      expect(transactions).toEqual([
        {
          accountId,
          transactionId: 'mockId1',
          merchant: 'ASDA',
          category: 'Groceries',
          amount: -20.5,
          transactionDate: '2021-10-16T20:55:39.656Z',
        },
        {
          accountId,
          transactionId: 'mockId2',
          merchant: 'B&Q',
          category: 'DIY',
          amount: 10,
          transactionDate: '2021-10-16T20:55:39.656Z',
        },
      ]);
    });

    describe('delete all transactions for account', () => {
      test('should delete from the database', async () => {
        await Transactions(userId).deleteAllTransactions(accountId);

        expect(deleteFromDatabase).toHaveBeenCalledWith([
          expect.objectContaining({
            PK: 'USER#usr123',
            SK: 'TRANSACTION#mockId1',
          }),
          expect.objectContaining({
            PK: 'USER#usr123',
            SK: 'TRANSACTION#mockId2',
          }),
        ]);
      });
    });
  });
});
