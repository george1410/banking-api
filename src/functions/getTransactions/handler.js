import Accounts from '../../database/accounts';
import Transactions from '../../database/transactions';
import generateResponse from '../../lib/generateResponse';

export const handler = async (event) => {
  const { accountId, transactionId } = event.pathParameters || {};
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  const transactions = Transactions(userId);
  const accounts = Accounts(userId);
  if (transactionId) {
    const transaction = await transactions.getTransaction(transactionId);
    return transaction
      ? generateResponse({ body: transaction })
      : generateResponse({
          statusCode: 404,
        });
  } else {
    const account = await accounts.getAccount(accountId);
    if (!account) {
      return generateResponse({
        statusCode: 404,
      });
    }

    const allTransactions = await transactions.getAllTransactions(accountId);
    return generateResponse({
      body: allTransactions,
    });
  }
};
