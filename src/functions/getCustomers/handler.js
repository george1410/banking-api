import Customers from '../../database/customers';
import generateResponse from '../../lib/generateResponse';

export const handler = async (event) => {
  const { customerId } = event.pathParameters || {};
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  const customers = Customers(userId);

  if (customerId) {
    const customer = await customers.getCustomer(customerId);
    return (
      generateResponse({ body: customer }) ||
      generateResponse({
        statusCode: 404,
      })
    );
  } else {
    const allCustomers = await customers.getAllCustomers();
    return generateResponse({
      body: allCustomers,
    });
  }
};
