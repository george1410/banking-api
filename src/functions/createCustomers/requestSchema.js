import Joi from 'joi';

const createCustomersBodySchema = Joi.compile(
  Joi.array()
    .items(
      Joi.object({
        firstName: Joi.string(),
        lastName: Joi.string(),
        email: Joi.string().email(),
        address: Joi.object({
          city: Joi.string(),
          streetAddress: Joi.string(),
          zipCode: Joi.string(),
          state: Joi.string(),
          country: Joi.string(),
        }).or('city', 'streetAddress', 'zipCode', 'state', 'country'),
      }).or('firstName', 'lastName', 'email', 'address')
    )
    .min(1)
    .label('Customers array')
);

export default createCustomersBodySchema;
