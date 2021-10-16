export default ({ body, statusCode = 200, headers }) => ({
  statusCode,
  body: JSON.stringify(body),
  headers: { 'Content-Type': 'application/json', ...headers },
});
