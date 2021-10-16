export default ({ body, statusCode }) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: { 'Content-Type': 'application/json' },
});
