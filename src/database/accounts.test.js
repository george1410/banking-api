import currency from 'currency.js';
import generateId from '../lib/generateId';
import Accounts from './accounts';
import deleteByKey from './common/deleteByKey';
import deleteFromDatabase from './common/deleteFromDatabase';
import fetchFromDatabase from './common/fetchFromDatabase';
import getByKey from './common/getByKey';
import updateItem from './common/updateItem';
import writeToDatabase from './common/writeToDatabase';

jest.mock('./common/writeToDatabase');
jest.mock('./common/getByKey');
jest.mock('./common/fetchFromDatabase');
jest.mock('./common/deleteByKey');
jest.mock('./common/deleteFromDatabase');
jest.mock('./common/updateItem');
jest.mock('../lib/generateId');

const userId = 'usr123';
const customerId = 'cust999';

generateId.mockReturnValue('mockId');
getByKey.mockReturnValue({
  balance: 123.45,
  accountType: 'Current',
  accountId: 'mockId1',
  customerId,
  PK: 'USER#usr123',
  SK: 'ACCOUNT#mockId1',
  GSI1PK: 'USER#usr123#CUSTOMER#cust999',
  GSI1SK: 'ACCOUNT#mockId1',
});
fetchFromDatabase.mockReturnValue([
  {
    balance: 123.45,
    accountType: 'Current',
    accountId: 'mockId1',
    customerId,
    PK: 'USER#usr123',
    SK: 'ACCOUNT#mockId1',
    GSI1PK: 'USER#usr123#CUSTOMER#cust999',
    GSI1SK: 'ACCOUNT#mockId1',
  },
  {
    balance: 10.2,
    accountType: 'Savings',
    accountId: 'mockId2',
    customerId,
    PK: 'USER#usr123',
    SK: 'ACCOUNT#mockId2',
    GSI1PK: 'USER#usr123#CUSTOMER#cust999',
    GSI1SK: 'ACCOUNT#mockId2',
  },
]);

describe('Accounts data layer', () => {
  describe('insert accounts', () => {
    test('should write to database with account data and internal attributes', async () => {
      const accountData = [
        { balance: currency(123.45), accountType: 'Current' },
        { balance: currency(10.2), accountType: 'Savings' },
      ];
      await Accounts(userId).insertAccounts(customerId, accountData);

      expect(writeToDatabase).toHaveBeenCalledWith([
        {
          balance: 123.45,
          accountType: 'Current',
          accountId: 'mockId',
          customerId,
          PK: 'USER#usr123',
          SK: 'ACCOUNT#mockId',
          GSI1PK: 'USER#usr123#CUSTOMER#cust999',
          GSI1SK: 'ACCOUNT#mockId',
        },
        {
          balance: 10.2,
          accountType: 'Savings',
          accountId: 'mockId',
          customerId,
          PK: 'USER#usr123',
          SK: 'ACCOUNT#mockId',
          GSI1PK: 'USER#usr123#CUSTOMER#cust999',
          GSI1SK: 'ACCOUNT#mockId',
        },
      ]);
    });

    test('should return serializable account data with IDs', async () => {
      const accountData = [
        { balance: currency(123.45), accountType: 'Current' },
        { balance: currency(10.2), accountType: 'Savings' },
      ];
      const accounts = await Accounts(userId).insertAccounts(
        customerId,
        accountData
      );

      expect(accounts).toEqual([
        {
          balance: 123.45,
          accountType: 'Current',
          accountId: 'mockId',
          customerId,
        },
        {
          balance: 10.2,
          accountType: 'Savings',
          accountId: 'mockId',
          customerId,
        },
      ]);
    });
  });

  describe('get single account', () => {
    test('should fetch from the database using the correct key', async () => {
      await Accounts(userId).getAccount('mockId1');
      expect(getByKey).toHaveBeenCalledWith('USER#usr123', 'ACCOUNT#mockId1');
    });

    test('should return serializable account data with IDs', async () => {
      const account = await Accounts(userId).getAccount('mockId1');

      expect(account).toEqual({
        balance: 123.45,
        accountType: 'Current',
        accountId: 'mockId1',
        customerId,
      });
    });

    test('should return null if the account does not exist', async () => {
      getByKey.mockReturnValueOnce(undefined);

      const account = await Accounts(userId).getAccount('mockId1');
      expect(account).toBeNull();
    });
  });

  describe('get all accounts for customer', () => {
    test('should fetch from the database using the correct query', async () => {
      await Accounts(userId).getAllAccounts(customerId);
      expect(fetchFromDatabase).toHaveBeenCalledWith(
        'GSI1PK = :PK and begins_with(GSI1SK, :SK)',
        {
          ':PK': `USER#usr123#CUSTOMER#cust999`,
          ':SK': `ACCOUNT#`,
        },
        'GSI1'
      );
    });

    test('should return serializable account data with IDs', async () => {
      const accounts = await Accounts(userId).getAllAccounts(customerId);

      expect(accounts).toEqual([
        {
          balance: 123.45,
          accountType: 'Current',
          accountId: 'mockId1',
          customerId,
        },
        {
          balance: 10.2,
          accountType: 'Savings',
          accountId: 'mockId2',
          customerId,
        },
      ]);
    });
  });

  describe('delete single account', () => {
    test('should delete from the database', async () => {
      await Accounts(userId).deleteAccount('mockId1');
      expect(deleteByKey).toHaveBeenCalledWith(
        'USER#usr123',
        'ACCOUNT#mockId1'
      );
    });
  });

  describe('delete all accounts for customer', () => {
    test('should delete from the database', async () => {
      await Accounts(userId).deleteAllAccounts(customerId);
      expect(deleteFromDatabase).toHaveBeenCalledWith([
        expect.objectContaining({
          PK: 'USER#usr123',
          SK: 'ACCOUNT#mockId1',
        }),
        expect.objectContaining({
          PK: 'USER#usr123',
          SK: 'ACCOUNT#mockId2',
        }),
      ]);
    });
  });

  describe('update account balance', () => {
    test('should increase the account balance in the database', async () => {
      await Accounts(userId).updateBalance('mockId', currency(23.45));
      expect(updateItem).toHaveBeenCalledWith(
        'USER#usr123',
        'ACCOUNT#mockId',
        'ADD balance :adjustment',
        { ':adjustment': 23.45 }
      );
    });

    test('should decrease the account balance in the database', async () => {
      await Accounts(userId).updateBalance('mockId', currency(-23.45));
      expect(updateItem).toHaveBeenCalledWith(
        'USER#usr123',
        'ACCOUNT#mockId',
        'ADD balance :adjustment',
        { ':adjustment': -23.45 }
      );
    });
  });
});
