import Joi from 'joi';
import schema from './requestSchema';

describe('Create accounts request schema', () => {
  test.each([
    [undefined],
    [[{ balance: 123 }]],
    [[{ balance: 123.4 }]],
    [[{ balance: 123.45 }]],
    [[{ accountType: 'Current' }]],
    [[{ accountType: 'Savings' }]],
    [[{ accountType: 'Savings', balance: 123.45 }]],
    [
      [
        { accountType: 'Savings', balance: 123.45 },
        { accountType: 'Current' },
        { balance: 123.45 },
      ],
    ],
  ])('accepts valid inputs', (input) => {
    expect(() => {
      Joi.assert(input, schema, { convert: false });
    }).not.toThrow(Joi.ValidationError);
  });

  test.each([
    [[]],
    ['hello'],
    [123],
    [true],
    [null],
    [['hello']],
    [[123]],
    [[true, false]],
    [[null]],
    [[undefined]],
    [[1, 2, 3]],
    [{}],
    [[{ accountType: 'Current' }, 'hello']],
    [[{ accountType: 'Current' }, { accountType: 'blah' }]],
    [[{ hello: 'Current' }, { bye: 'blah' }]],
    [[{ accountType: 'Current' }, { bye: 'Savings' }]],
    [[{ accountType: 'blah' }]],
    [[{ accountType: 123 }]],
    [[{ balance: 123.456 }]],
    [[{ balance: '123.45' }]],
    [[{ balance: 123.456 }, { balance: '123.45' }]],
  ])('rejects invalid inputs', (input) => {
    expect(() => {
      Joi.assert(input, schema, { convert: false });
    }).toThrow(Joi.ValidationError);
  });
});
