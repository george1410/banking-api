import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import ddbClient from '../../../src/database/common/ddbClient';

const mockUserId = 'mock-user-1234';
export const mockAccounts = [
  {
    balance: 0,
    accountType: 'Current',
    PK: `USER#${mockUserId}`,
    SK: `ACCOUNT#9`,
    customerId: '2',
    GSI1PK: `USER#${mockUserId}#CUSTOMER#2`,
    GSI1SK: `ACCOUNT#9`,
    accountId: '9',
  },
  {
    balance: 12.34,
    accountType: 'Savings',
    PK: `USER#${mockUserId}`,
    SK: `ACCOUNT#8`,
    customerId: '2',
    GSI1PK: `USER#${mockUserId}#CUSTOMER#2`,
    GSI1SK: `ACCOUNT#8`,
    accountId: '8',
  },
  {
    balance: 98.76,
    accountType: 'Savings',
    PK: `USER#mock-user-9999`,
    SK: `ACCOUNT#8`,
    customerId: '3',
    GSI1PK: `USER#mock-user-9999#CUSTOMER#3`,
    GSI1SK: `ACCOUNT#8`,
    accountId: '8',
  },
];

const insertMockAccounts = async () => {
  const params = {
    RequestItems: {
      'banking-api': mockAccounts.map((account) => ({
        PutRequest: { Item: account },
      })),
    },
  };
  await ddbClient.send(new BatchWriteCommand(params));
};

export default insertMockAccounts;
