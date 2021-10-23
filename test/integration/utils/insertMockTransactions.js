import { BatchWriteCommand } from '@aws-sdk/lib-dynamodb';
import ddbClient from '../../../src/database/common/ddbClient';

const mockUserId = 'mock-user-1234';
export const mockTransactions = [
  {
    accountId: '9',
    transactionId: '5555',
    amount: 12.34,
    transactionDate: '2021-10-23T14:50:36.459Z',
    merchant: 'ASDA',
    category: 'Groceries',
    PK: `USER#${mockUserId}`,
    SK: `TRANSACTION#5555`,
    GSI1PK: `USER#${mockUserId}#ACCOUNT#9`,
    GSI1SK: `TRANSACTION#2021-10-23T14:50:36.459Z`,
  },
  {
    accountId: '9',
    transactionId: '6666',
    amount: -43.21,
    transactionDate: '2021-10-23T15:50:36.459Z',
    merchant: 'STARBUCKS',
    category: 'Coffee',
    PK: `USER#${mockUserId}`,
    SK: `TRANSACTION#6666`,
    GSI1PK: `USER#${mockUserId}#ACCOUNT#9`,
    GSI1SK: `TRANSACTION#2021-10-23T15:50:36.459Z`,
  },
];

const insertMockTransactions = async () => {
  const params = {
    RequestItems: {
      'banking-api': mockTransactions.map((transaction) => ({
        PutRequest: { Item: transaction },
      })),
    },
  };
  await ddbClient.send(new BatchWriteCommand(params));
};

export default insertMockTransactions;
