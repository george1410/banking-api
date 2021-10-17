import deleteByKey from './common/deleteByKey';
import deleteFromDatabase from './common/deleteFromDatabase';
import fetchFromDatabase from './common/fetchFromDatabase';
import generateId from '../lib/generateId';
import getByKey from './common/getByKey';
import stripInternalAttributes from './common/stripInternalAttributes';
import updateItem from './common/updateItem';
import writeToDatabase from './common/writeToDatabase';

const addMetadata = (userId, customerId) => (accountData) => {
  const accountId = generateId();
  const account = {
    ...accountData,
    balance: accountData.balance.value,
    accountId,
    customerId,
    PK: `USER#${userId}`,
    SK: `ACCOUNT#${accountId}`,
    GSI1PK: `USER#${userId}#CUSTOMER#${customerId}`,
    GSI1SK: `ACCOUNT#${accountId}`,
  };
  return account;
};

const insertAccounts = async (userId, customerId, accountData) => {
  const accounts = accountData.map(addMetadata(userId, customerId));

  await writeToDatabase(accounts);

  return accounts.map(stripInternalAttributes);
};

const getAllAccounts = async (userId, customerId) => {
  const KeyConditionExpression = 'GSI1PK = :PK and begins_with(GSI1SK, :SK)';

  const expressionAttributeValues = {
    ':PK': `USER#${userId}#CUSTOMER#${customerId}`,
    ':SK': `ACCOUNT#`,
  };

  const accounts = await fetchFromDatabase(
    KeyConditionExpression,
    expressionAttributeValues,
    'GSI1'
  );

  return accounts.map(stripInternalAttributes);
};

const getAccount = async (userId, accountId) => {
  const account = await getByKey(`USER#${userId}`, `ACCOUNT#${accountId}`);
  return account ? stripInternalAttributes(account) : null;
};

const deleteAccount = async (userId, accountId) =>
  deleteByKey(`USER#${userId}`, `ACCOUNT#${accountId}`);

const deleteAllAccounts = async (userId, customerId) => {
  const KeyConditionExpression = 'GSI1PK = :PK and begins_with(GSI1SK, :SK)';

  const expressionAttributeValues = {
    ':PK': `USER#${userId}#CUSTOMER#${customerId}`,
    ':SK': `ACCOUNT#`,
  };

  const accountsToDelete = await fetchFromDatabase(
    KeyConditionExpression,
    expressionAttributeValues,
    'GSI1'
  );

  await deleteFromDatabase(accountsToDelete);
};

const updateBalance = async (userId, accountId, adjustment) =>
  updateItem(
    `USER#${userId}`,
    `ACCOUNT#${accountId}`,
    `ADD balance :adjustment`,
    { ':adjustment': adjustment.value }
  );

export default (userId) => ({
  insertAccounts: async (customerId, accountData) =>
    insertAccounts(userId, customerId, accountData),
  getAccount: async (accountId) => getAccount(userId, accountId),
  getAllAccounts: async (customerId) => getAllAccounts(userId, customerId),
  deleteAccount: async (accountId) => deleteAccount(userId, accountId),
  deleteAllAccounts: async (customerId) =>
    deleteAllAccounts(userId, customerId),
  updateBalance: async (accountId, adjustment) =>
    updateBalance(userId, accountId, adjustment),
});
