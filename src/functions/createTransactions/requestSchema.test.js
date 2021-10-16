import Joi from 'joi';
import schema from './requestSchema';

describe('Create transactions request schema', () => {
  test.each([
    [undefined],
    [[{ merchant: 'ASDA' }]],
    [[{ category: 'DIY' }]],
    [[{ amount: 123.23 }]],
    [[{ amount: -123.23 }]],
    [[{ amount: -123.2 }]],
    [[{ amount: 123 }]],
    [[{ transactionDate: '2021-10-16T18:27:44.848Z' }]],
    [
      [
        {
          merchant: 'ASDA',
          category: 'DIY',
          amount: 123.23,
          transactionDate: '2021-10-16T18:27:44.848Z',
        },
      ],
    ],
    [
      [
        {
          merchant: 'ASDA',
          transactionDate: '2021-10-16T18:27:44.848Z',
        },
        {
          merchant: 'Sainsburys',
          category: 'Groceries',
          amount: -83.22,
          transactionDate: '2020-01-23T09:54:32.629Z',
        },
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
    [[{ blah: 'qwerty' }]],
    [[{ amount: 0 }]],
    [[{ amount: 0.0 }]],
    [[{ amount: 123.456 }]],
    [[{ amount: '12' }]],
    [[{ merchant: true }]],
    [[{ category: ['hello', 'world'] }]],
    [[{ category: 'DIY', blah: 'stuff' }]],
    [[{ transactionDate: 'notAdate' }]],
    [[{ amount: 12 }, { amount: '122' }]],
  ])('rejects invalid inputs', (input) => {
    expect(() => {
      Joi.assert(input, schema, { convert: false });
    }).toThrow(Joi.ValidationError);
  });
});
