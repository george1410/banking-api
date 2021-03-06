const validateRequestBody = (body, schema) => {
  let parsedBody = body;
  if (body !== undefined) {
    try {
      parsedBody = JSON.parse(body);
    } catch (err) {
      return {
        error: {
          message: 'Malformed JSON',
        },
      };
    }
  }

  const result = schema.validate(parsedBody, {
    convert: false,
    abortEarly: false,
    errors: { wrap: { label: false } },
  });

  if (result.error) {
    return {
      error: {
        message: 'Invalid request body',
        details: result.error.details.map(({ message }) => message),
      },
    };
  }

  return result;
};

export default validateRequestBody;
