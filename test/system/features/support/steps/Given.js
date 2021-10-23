/* eslint-disable func-names */
const { Given } = require('@cucumber/cucumber');

Given('I make a {word} request to {word}', function (method, endpoint) {
  this.context.method = method;
  this.context.url = endpoint;
});

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
