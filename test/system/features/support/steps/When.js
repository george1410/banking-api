/* eslint-disable func-names */
const { When } = require('@cucumber/cucumber');
const axios = require('axios');

When('I receive a response', async function () {
  try {
    if (this.context.method === 'POST') {
      this.context.response = await axios[this.context.method.toLowerCase()](
        this.context.url,
        this.context.body,
        {
          headers: this.context.headers,
        }
      );
    } else {
      this.context.response = await axios[this.context.method.toLowerCase()](
        this.context.url,
        {
          headers: this.context.headers,
        }
      );
    }
  } catch (err) {
    if (err.response) {
      this.context.response = err.response;
    } else {
      throw err;
    }
  }
});
