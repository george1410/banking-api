import Joi from 'joi';
import schema from './requestSchema';

describe('Create customers request schema', () => {
  test.each([
    [undefined],
    [[{ firstName: 'George' }]],
    [[{ lastName: 'McCarron' }]],
    [[{ email: 'hello@georgemccarron.com' }]],
    [[{ address: { streetAddress: '10 High Street' } }]],
    [[{ address: { city: 'London' } }]],
    [[{ address: { state: 'California' } }]],
    [[{ address: { zipCode: '12345' } }]],
    [[{ address: { country: 'France' } }]],
    [
      [
        {
          firstName: 'George',
          lastName: 'McCarron',
          email: 'hello@georgemccarron.com',
          address: {
            streetAddress: '10 High Street',
            city: 'London',
            state: 'California',
            zipCode: '12345',
            country: 'France',
          },
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
    [[{ firstName: 123 }]],
    [[{ lastName: 123 }]],
    [[{ email: 123 }]],
    [[{ email: 'notAnEmail.com' }]],
    [[{ address: {} }]],
    [[{ address: { wut: 'stuff' } }]],
    [[{ address: { city: 'London', wut: 'stuff' } }]],
    [[{ address: { city: 'London' } }, { random: 'thing' }]],
  ])('rejects invalid inputs', (input) => {
    expect(() => {
      Joi.assert(input, schema, { convert: false });
    }).toThrow(Joi.ValidationError);
  });
});
