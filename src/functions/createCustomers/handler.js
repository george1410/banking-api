import Customers from '../../database/customers';
import generateResponse from '../../lib/generateResponse';
import validateRequestBody from '../../lib/validateRequestBody';
import generateCustomers from './generateCustomers';
import createCustomersBodySchema from './requestSchema';

export const handler = async (event) => {
  const { quantity } = event.queryStringParameters || {};
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  if (quantity !== undefined && !Number(quantity)) {
    return generateResponse({
      statusCode: 400,
      body: { error: { message: 'Invalid quantity' } },
    });
  }

  const { value: customData = null, error = null } = validateRequestBody(
    event.body,
    createCustomersBodySchema
  );

  if (error) {
    return generateResponse({
      statusCode: 400,
      body: { error },
    });
  }

  const newCustomers = await generateCustomers(customData, quantity);

  const customers = await Customers(userId).insertCustomers(newCustomers);

  return generateResponse({
    statusCode: 201,
    body: customers,
  });
};
