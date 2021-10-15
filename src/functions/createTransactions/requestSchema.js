import Joi from 'joi';

const createTransactionsBodySchema = Joi.compile(
  Joi.array()
    .items(
      Joi.object({
        merchant: Joi.string(),
        category: Joi.string(),
        amount: Joi.number().precision(2),
        transactionDate: Joi.date().iso(),
      }).or('merchant', 'category', 'amount', 'transactionDate')
    )
    .min(1)
    .label('Transactions array')
);

export default createTransactionsBodySchema;
