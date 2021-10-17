import Accounts from '../../database/accounts';

export const handler = async (event) => {
  const userId = event.requestContext.authorizer.jwt.claims.sub;
  const { customerId, accountId } = event.pathParameters || {};

  const accounts = Accounts(userId);
  try {
    if (accountId) {
      await accounts.deleteAccount(accountId);
    } else {
      await accounts.deleteAllAccounts(customerId);
    }

    return generateResponse({
      statusCode: 200,
    });
  } catch (err) {
    return generateResponse({
      statusCode: 500,
      body: { error },
    });
  }
};
