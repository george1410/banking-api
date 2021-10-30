/* eslint-disable func-names */
const { Given, When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const { assertThat, equalTo, is } = require('hamjest');
const { default: clearUserData } = require('../utils/clearUserData');

/* ----------------------------- GIVEN ----------------------------- */
Given('I have no auth token', function () {
  this.context.headers = {
    ...this.context.headers,
    Authorization: null,
  };
});

Given('I have an invalid auth token', function () {
  this.context.headers = {
    ...this.context.headers,
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.e30.A8-G5pbk-OKzTtSkihZFoV608WjHb6BANhPuPHlSIog`,
  };
});

Given('I have a valid auth token', function () {
  this.context.headers = {
    ...this.context.headers,
    Authorization: `Bearer ${process.env.BEARER_TOKEN}`,
  };
});

Given('I set the quantity parameter to {int}', function (quantity) {
  this.context.params = {
    ...this.context.params,
    quantity,
  };
});

Given('I have not created any data', async () => {
  await clearUserData();
});

/* ----------------------------- WHEN ----------------------------- */
When(
  /^I make a (.*) request to ([^\s\\]+)$/,
  async function (method, endpoint) {
    try {
      if (method === 'POST') {
        this.context.response = await axios[method.toLowerCase()](
          endpoint,
          this.context.body,
          {
            headers: this.context.headers,
            params: this.context.params,
          }
        );
      } else {
        this.context.response = await axios[method.toLowerCase()](endpoint, {
          headers: this.context.headers,
        });
      }
    } catch (err) {
      if (err.response) {
        this.context.response = err.response;
      } else {
        throw err;
      }
    }
  }
);

/* ----------------------------- THEN ----------------------------- */
Then('I expect the response to have status {int}', function (code) {
  assertThat(this.context.response.status, equalTo(code));
});

Then('I expect the response to be empty', function () {
  assertThat(this.context.response.data, is(''));
});

Then('I expect the response to have json body', function (json) {
  assertThat(this.context.response.data, equalTo(JSON.parse(json)));
});

Then(
  /^I expect the response to be an array containing (\d+) items?$/,
  function (count) {
    assertThat(this.context.response.data.length, equalTo(count));
  }
);
