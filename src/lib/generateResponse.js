export default ({ body, statusCode = 200, headers }) => ({
  statusCode,
  body: body ? JSON.stringify(body) : null,
  headers: { 'Content-Type': 'application/json', ...headers },
});
