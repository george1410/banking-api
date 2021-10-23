import Accounts from '../../database/accounts';
import Customers from '../../database/customers';
import generateResponse from '../../lib/generateResponse';

export const handler = async (event) => {
  const userId = event.requestContext.authorizer.jwt.claims.sub;
  const { customerId, accountId } = event.pathParameters || {};

  const accounts = Accounts(userId);
  const customers = Customers(userId);
  try {
    if (accountId) {
      const deletedItem = await accounts.deleteAccount(accountId);
      if (!deletedItem) {
        return generateResponse({
          statusCode: 404,
        });
      }
    } else {
      if (!(await customers.getCustomer(customerId))) {
        return generateResponse({
          statusCode: 404,
        });
      }
      await accounts.deleteAllAccounts(customerId);
    }

    return generateResponse({
      statusCode: 200,
    });
  } catch (err) {
    return generateResponse({
      statusCode: 500,
    });
  }
};
