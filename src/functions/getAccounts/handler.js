import Accounts from '../../database/accounts';
import generateResponse from '../../lib/generateResponse';

export const handler = async (event) => {
  const { accountId, customerId } = event.pathParameters || {};
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  const accounts = Accounts(userId);

  if (accountId) {
    const account = await accounts.getAccount(accountId);
    return (
      generateResponse({ body: account }) ||
      generateResponse({
        statusCode: 404,
      })
    );
  } else {
    const allAccounts = await accounts.getAllAccounts(customerId);
    return generateResponse({
      body: allAccounts,
    });
  }
};
