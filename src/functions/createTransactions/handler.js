import Transactions from '../../database/transactions';
import validateRequestBody from '../../lib/validateRequestBody';
import generateTransactions from './generateTransactions';
import createTransactionsBodySchema from './requestSchema';

export const handler = async (event) => {
  const { quantity } = event.queryStringParameters || {};
  const { accountId } = event.pathParameters;
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  const { value: customData = null, error = null } = event.body
    ? validateRequestBody(event.body, createTransactionsBodySchema)
    : {};

  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error }),
    };
  }

  const newTransactions = await generateTransactions(customData, quantity);

  const transactions = await Transactions(userId).insertTransactions(
    accountId,
    newTransactions
  );

  return transactions;
};
