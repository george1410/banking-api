import Transactions from '../../database/transactions';
import generateResponse from '../../lib/generateResponse';
import validateRequestBody from '../../lib/validateRequestBody';
import generateTransactions from './generateTransactions';
import createTransactionsBodySchema from './requestSchema';

export const handler = async (event) => {
  const { quantity } = event.queryStringParameters || {};
  const { accountId } = event.pathParameters;
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  if (quantity !== undefined && !Number(quantity)) {
    return generateResponse({
      statusCode: 400,
      body: { error: { message: 'Invalid quantity' } },
    });
  }

  const { value: customData = null, error = null } = validateRequestBody(
    event.body,
    createTransactionsBodySchema
  );

  if (error) {
    return generateResponse({
      statusCode: 400,
      body: { error },
    });
  }

  const newTransactions = await generateTransactions(customData, quantity);

  const transactions = await Transactions(userId).insertTransactions(
    accountId,
    newTransactions
  );

  return generateResponse({
    statusCode: 201,
    body: transactions,
  });
};
