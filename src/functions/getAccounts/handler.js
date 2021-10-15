import Accounts from '../../database/accounts';

export const handler = async (event) => {
  const { accountId, customerId } = event.pathParameters || {};
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  const accounts = Accounts(userId);

  if (accountId) {
    const account = await accounts.getAccount(accountId);
    return account || { statusCode: 404 };
  } else {
    return await accounts.getAllAccounts(customerId);
  }
};
