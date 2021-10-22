import Accounts from '../../database/accounts';
import Customers from '../../database/customers';
import generateResponse from '../../lib/generateResponse';

export const handler = async (event) => {
  const { accountId, customerId } = event.pathParameters || {};
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  const accounts = Accounts(userId);
  const customers = Customers(userId);

  if (accountId) {
    const account = await accounts.getAccount(accountId);
    return account
      ? generateResponse({ body: account })
      : generateResponse({
          statusCode: 404,
        });
  } else {
    const customer = await customers.getCustomer(customerId);
    if (customer) {
      const allAccounts = await accounts.getAllAccounts(customerId);
      return generateResponse({
        body: allAccounts,
      });
    } else {
      return generateResponse({
        statusCode: 404,
      });
    }
  }
};
