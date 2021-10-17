import Accounts from '../../database/accounts';
import Customers from '../../database/customers';
import generateResponse from '../../lib/generateResponse';
import validateRequestBody from '../../lib/validateRequestBody';
import generateAccounts from './generateAccounts';
import createAccountsBodySchema from './requestSchema';

export const handler = async (event) => {
  const { quantity } = event.queryStringParameters || {};
  const { customerId } = event.pathParameters;
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  if (!(await Customers(userId).getCustomer(customerId))) {
    return generateResponse({
      statusCode: 404,
    });
  }

  if (quantity !== undefined && !Number(quantity)) {
    return generateResponse({
      statusCode: 400,
      body: { error: { message: 'Invalid quantity' } },
    });
  }

  const { value: customData = null, error = null } = validateRequestBody(
    event.body,
    createAccountsBodySchema
  );

  if (error) {
    return generateResponse({
      statusCode: 400,
      body: { error },
    });
  }

  const newAccounts = generateAccounts(customData, quantity);

  const accounts = await Accounts(userId).insertAccounts(
    customerId,
    newAccounts
  );

  return generateResponse({
    statusCode: 201,
    body: accounts,
  });
};
