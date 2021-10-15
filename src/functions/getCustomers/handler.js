import Customers from '../../database/customers';

export const handler = async (event) => {
  const { customerId } = event.pathParameters || {};
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  const customers = Customers(userId);

  if (customerId) {
    const customer = await customers.getCustomer(customerId);
    return customer || { statusCode: 404 };
  } else {
    return await customers.getAllCustomers();
  }
};
