import Joi from 'joi';

const createTransactionsBodySchema = Joi.compile(
  Joi.array()
    .items(
      Joi.object({
        merchant: Joi.string(),
        category: Joi.string(),
        amount: Joi.number().precision(2).invalid(0),
        transactionDate: Joi.string().isoDate(),
      }).or('merchant', 'category', 'amount', 'transactionDate')
    )
    .min(1)
    .label('Transactions array')
);

export default createTransactionsBodySchema;
