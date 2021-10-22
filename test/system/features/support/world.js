const { Before } = require('@cucumber/cucumber');
const { request } = require('pactum');

Before(() => {
  request.setBaseUrl('https://banking-api.aws.georgemccarron.com');
});
