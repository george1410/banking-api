const { setWorldConstructor, World } = require('@cucumber/cucumber');
const axios = require('axios');

axios.defaults.baseURL = 'https://banking-api.aws.georgemccarron.com';

class CustomWorld extends World {
  constructor(options) {
    // needed so `attach`, `log` and `parameters` are properly set
    super(options);
    this.context = {};
  }
}

setWorldConstructor(CustomWorld);
