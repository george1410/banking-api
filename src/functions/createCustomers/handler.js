import Customers from '../../database/customers';
import generateResponse from '../../lib/generateResponse';
import validateRequestBody from '../../lib/validateRequestBody';
import generateCustomers from './generateCustomers';
import createCustomersBodySchema from './requestSchema';

export const handler = async (event) => {
  const { quantity } = event.queryStringParameters || {};
  const userId = event.requestContext.authorizer.jwt.claims.sub;

  const { value: customData = null, error = null } = event.body
    ? validateRequestBody(event.body, createCustomersBodySchema)
    : {};

  if (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error }),
    };
  }

  const newCustomers = await generateCustomers(customData, quantity);

  const customers = await Customers(userId).insertCustomers(newCustomers);

  return generateResponse({
    statusCode: 201,
    body: customers,
  });
};
