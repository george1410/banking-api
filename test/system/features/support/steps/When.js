/* eslint-disable func-names */
const { When } = require('@cucumber/cucumber');
const axios = require('axios');

When('I make a {word} request to {word}', async function (method, endpoint) {
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
});
