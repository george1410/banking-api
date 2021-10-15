import Joi from 'joi';

const createAccountsBodySchema = Joi.compile(
  Joi.array()
    .items(
      Joi.object({
        balance: Joi.number().precision(2),
        accountType: Joi.string().valid('Current', 'Savings'),
      }).or('balance', 'accountType')
    )
    .min(1)
    .label('Accounts array')
);

export default createAccountsBodySchema;
