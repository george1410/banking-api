import fetchFromDatabase from '../lib/fetchFromDatabase';
import generateId from '../lib/generateId';
import getByKey from '../lib/getByKey';
import stripInternalAttributes from '../lib/stripInternalAttributes';
import writeToDatabase from '../lib/writeToDatabase';

const addMetadata = (userId) => (customerData) => {
  const customerId = generateId();
  const customer = {
    ...customerData,
    customerId,
    PK: `USER#${userId}`,
    SK: `CUSTOMER#${customerId}`,
  };
  return customer;
};

const insertCustomers = async (userId, customerData) => {
  const customers = customerData.map(addMetadata(userId));

  await writeToDatabase(customers);

  return customers.map(stripInternalAttributes);
};

const getAllCustomers = async (userId) => {
  const KeyConditionExpression = 'PK = :PK and begins_with(SK, :SK)';

  const expressionAttributeValues = {
    ':PK': `USER#${userId}`,
    ':SK': `CUSTOMER#`,
  };

  const customers = await fetchFromDatabase(
    KeyConditionExpression,
    expressionAttributeValues
  );

  return customers.map(stripInternalAttributes);
};

const getCustomer = async (userId, customerId) => {
  const customer = await getByKey(`USER#${userId}`, `CUSTOMER#${customerId}`);

  return stripInternalAttributes(customer);
};

export default (userId) => ({
  insertCustomers: async (customerData) =>
    insertCustomers(userId, customerData),
  getCustomer: async (customerId) => getCustomer(userId, customerId),
  getAllCustomers: async () => getAllCustomers(userId),
});
