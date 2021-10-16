import generateResponse from './generateResponse';

describe('Generate response', () => {
  test('should set a custom status code if provided', () => {
    expect(generateResponse({ statusCode: 500 })).toHaveProperty(
      'statusCode',
      500
    );
  });

  test('should set the status code to 200 by default', () => {
    expect(generateResponse({})).toHaveProperty('statusCode', 200);
  });

  test('should set a custom body as JSON if provided', () => {
    const testBody = { a: 1, b: [2, 3, 4] };
    expect(generateResponse({ body: testBody })).toHaveProperty(
      'body',
      JSON.stringify(testBody)
    );
  });

  test('should set the body to undefined by default', () => {
    expect(generateResponse({})).toHaveProperty('body', undefined);
  });

  test('should set custom headers alongside defaults if provided', () => {
    expect(
      generateResponse({ headers: { 'Test-Header': 'abc' } })
    ).toHaveProperty('headers', {
      'Content-Type': 'application/json',
      'Test-Header': 'abc',
    });
  });

  test('should override default headers with custom header value if provided', () => {
    expect(
      generateResponse({ headers: { 'Content-Type': 'random' } })
    ).toHaveProperty('headers', {
      'Content-Type': 'random',
    });
  });

  test('should set the default headers if no custom ones provided', () => {
    expect(generateResponse({})).toHaveProperty('headers', {
      'Content-Type': 'application/json',
    });
  });

  test('should allow all of the custom values to be set', () => {
    expect(
      generateResponse({
        statusCode: 404,
        headers: { Blah: 'testHeaderValue' },
        body: { a: 123 },
      })
    ).toEqual({
      statusCode: 404,
      headers: { 'Content-Type': 'application/json', Blah: 'testHeaderValue' },
      body: `{"a":123}`,
    });
  });
});
