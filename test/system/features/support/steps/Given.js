/* eslint-disable func-names */
const { Given } = require('@cucumber/cucumber');
const { default: clearUserData } = require('../utils/clearUserData');

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
