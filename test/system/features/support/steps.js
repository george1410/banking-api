const { Given, When, Then } = require('@cucumber/cucumber');
const assert = require('assert').strict;
const axios = require('axios');

Given(/^I make a (.*) request to (.*)$/, function (method, endpoint) {
  this.context.method = method;
  this.context.url = endpoint;
});

Given('I have no auth token', function () {
  this.context.headers = {
    ...this.context.headers,
    Authorization: null,
  };
});

Given(/^I have an invalid auth token$/, function () {
  this.context.headers = {
    ...this.context.headers,
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.A8-G5pbk-OKzTtSkihZFoV608WjHb6BANhPuPHlSIog`,
  };
});

Given(/^I have a valid auth token$/, function () {
  this.context.headers = {
    ...this.context.headers,
    Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
  };
});

When('I receive a response', async function () {
  try {
    this.context.response = await axios[this.context.method.toLowerCase()](
      this.context.url,
      {
        headers: this.context.headers,
      }
    );
  } catch (err) {
    if (err.response) {
      this.context.response = err.response;
    } else {
      throw err;
    }
  }
});

Then('I expect the response to have status {int}', function (code) {
  assert.equal(this.context.response.status, code);
});

Then(/^I expect the response to have json body$/, function (json) {
  assert.deepEqual(this.context.response.data, JSON.parse(json));
});
