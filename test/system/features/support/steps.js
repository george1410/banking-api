const { Given, When, Then, Before, After } = require('@cucumber/cucumber');
const pactum = require('pactum');

let spec = pactum.spec();

Before(() => {
  spec = pactum.spec();
});

Given(/^I make an unauthorized (.*) request to (.*)$/, (method, endpoint) => {
  spec[method.toLowerCase()](endpoint);
});

Given(
  /^I make a (.*) request with invalid token to (.*)$/,
  (method, endpoint) => {
    spec[method.toLowerCase()](endpoint);
    spec.withHeaders(
      'Authorization',
      'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.A8-G5pbk-OKzTtSkihZFoV608WjHb6BANhPuPHlSIog'
    );
  }
);

When('I receive a response', async () => {
  await spec.toss();
});

Then('I expect the response to have status {int}', function (code) {
  spec.response().should.have.status(code);
});

Then(/^I expect the response to have json body$/, function (json) {
  spec.response().should.have.json(JSON.parse(json));
});

After(() => {
  spec.end();
});
