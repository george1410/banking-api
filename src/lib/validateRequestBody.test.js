import Joi from 'joi';
import validateRequestBody from './validateRequestBody';

const testSchema = Joi.compile(
  Joi.object({
    name: Joi.string(),
    status: Joi.string().valid('Online', 'Offline'),
  })
);

const malformedBody = `{"hello": world}`;
const validBody = `{"name": "George", "status": "Offline"}`;
const singleInvalidBody = `{"name": "George", "status": "SomethingElse"}`;
const multipleInvalidBody = `{"name": 123, "status": "SomethingElse"}`;

describe('Validate request body', () => {
  test('should return malformed json error message if the body cannot be parsed', () => {
    const result = validateRequestBody(malformedBody, testSchema);
    expect(result).toEqual({
      error: {
        message: 'Malformed JSON',
      },
    });
  });

  test('should return an object with the parsed body under the value property if it matches the schema', () => {
    const result = validateRequestBody(validBody, testSchema);
    expect(result.value).toEqual({
      name: 'George',
      status: 'Offline',
    });
  });

  test('should return an object without an error property if the body matches the schema', () => {
    const result = validateRequestBody(validBody, testSchema);
    expect(result).not.toHaveProperty('error');
  });

  test('should return an error property if the body does not match the schema', () => {
    const result = validateRequestBody(singleInvalidBody, testSchema);
    expect(result).toHaveProperty('error');
  });

  test('should return invalid request body error message if the body does not match the schema', () => {
    const result = validateRequestBody(singleInvalidBody, testSchema);
    expect(result.error).toHaveProperty('message', 'Invalid request body');
  });

  test('should return details array if the body does not match the schema', () => {
    const result = validateRequestBody(singleInvalidBody, testSchema);
    expect(result.error.details).toEqual(expect.any(Array));
  });

  test('should provide single error message in details array if the body does not match the schema', () => {
    const result = validateRequestBody(singleInvalidBody, testSchema);
    expect(result.error.details).toEqual([
      'status must be one of [Online, Offline]',
    ]);
  });

  test('should provide multiple error messages in details array if the body does not match the schema', () => {
    const result = validateRequestBody(multipleInvalidBody, testSchema);
    expect(result.error.details).toEqual([
      'name must be a string',
      'status must be one of [Online, Offline]',
    ]);
  });
});
