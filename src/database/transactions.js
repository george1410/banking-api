import currency from 'currency.js';
import deleteFromDatabase from './common/deleteFromDatabase';
import fetchFromDatabase from './common/fetchFromDatabase';
import generateId from '../lib/generateId';
import getByKey from './common/getByKey';
import stripInternalAttributes from './common/stripInternalAttributes';
import writeToDatabase from './common/writeToDatabase';
import Accounts from './accounts';

const addMetadata = (userId, accountId) => (transactionData) => {
  const transactionId = generateId();
  const account = {
    ...transactionData,
    accountId,
    transactionId,
    amount: transactionData.amount.value,
    PK: `USER#${userId}`,
    SK: `TRANSACTION#${transactionId}`,
    GSI1PK: `USER#${userId}#ACCOUNT#${accountId}`,
    GSI1SK: `TRANSACTION#${transactionData.transactionDate}`,
  };
  return account;
};

const insertTransactions = async (userId, accountId, transactionData) => {
  const transactions = transactionData.map(addMetadata(userId, accountId));

  await writeToDatabase(transactions);

  const totalAmount = transactions.reduce(
    (acc, cur) => acc.add(cur.amount),
    currency(0)
  );

  await Accounts(userId).updateBalance(accountId, totalAmount);

  return transactions.map(stripInternalAttributes);
};

const getAllTransactions = async (userId, accountId) => {
  const KeyConditionExpression = 'GSI1PK = :PK and begins_with(GSI1SK, :SK)';

  const expressionAttributeValues = {
    ':PK': `USER#${userId}#ACCOUNT#${accountId}`,
    ':SK': `TRANSACTION#`,
  };

  const transactions = await fetchFromDatabase(
    KeyConditionExpression,
    expressionAttributeValues,
    'GSI1'
  );

  return transactions.map(stripInternalAttributes);
};

const getTransaction = async (userId, transactionId) => {
  const transaction = await getByKey(
    `USER#${userId}`,
    `TRANSACTION#${transactionId}`
  );

  return transaction ? stripInternalAttributes(transaction) : null;
};

const deleteAllTransactions = async (userId, accountId) => {
  const KeyConditionExpression = 'GSI1PK = :PK and begins_with(GSI1SK, :SK)';

  const expressionAttributeValues = {
    ':PK': `USER#${userId}#ACCOUNT#${accountId}`,
    ':SK': `TRANSACTION#`,
  };

  const transactionsToDelete = await fetchFromDatabase(
    KeyConditionExpression,
    expressionAttributeValues,
    'GSI1'
  );

  await deleteFromDatabase(transactionsToDelete);
};

export default (userId) => ({
  insertTransactions: async (accountId, transactionData) =>
    insertTransactions(userId, accountId, transactionData),
  getTransaction: async (transactionId) =>
    getTransaction(userId, transactionId),
  getAllTransactions: async (accountId) =>
    getAllTransactions(userId, accountId),
  deleteAllTransactions: async (accountId) =>
    deleteAllTransactions(userId, accountId),
});
