import Transactions from '../../database/transactions';

export const handler = async (event) => {
  const { accountId, transactionId } = event.pathParameters || {};
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  const transactions = Transactions(userId);
  if (transactionId) {
    const transaction = await transactions.getTransaction(transactionId);
    return transaction || { statusCode: 404 };
  } else {
    return await transactions.getAllTransactions(accountId);
  }
};
