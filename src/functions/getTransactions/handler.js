import Transactions from '../../database/transactions';
import generateResponse from '../../lib/generateResponse';

export const handler = async (event) => {
  const { accountId, transactionId } = event.pathParameters || {};
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  const transactions = Transactions(userId);
  if (transactionId) {
    const transaction = await transactions.getTransaction(transactionId);
    return (
      generateResponse({ body: transaction }) ||
      generateResponse({
        statusCode: 404,
      })
    );
  } else {
    const allTransactions = await transactions.getAllTransactions(accountId);
    return generateResponse({
      body: allTransactions,
    });
  }
};
