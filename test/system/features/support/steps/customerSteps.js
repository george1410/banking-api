/* eslint-disable func-names */
const { When, Then } = require('@cucumber/cucumber');
const axios = require('axios');
const { assertThat, hasProperties, string, everyItem, is } = require('hamjest');

/* ----------------------------- GIVEN ----------------------------- */

/* ----------------------------- WHEN ----------------------------- */
When(
  /^I make a GET request to \/customers\/customerId with the new customerId$/,
  async function () {
    const endpoint = `/customers/${this.context.newCustomerId}`;
    try {
      this.context.response = await axios.get(endpoint, {
        headers: this.context.headers,
      });
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
Then('I expect each item to be a valid customer object', function () {
  assertThat(
    this.context.response.data,
    everyItem(
      hasProperties({
        customerId: string(),
        firstName: string(),
        lastName: string(),
        email: string(),
        address: hasProperties({
          zipCode: string(),
          country: string(),
          state: string(),
          city: string(),
          streetAddress: string(),
        }),
      })
    )
  );
});

Then('I expect the response to be a valid customer object', function () {
  assertThat(
    this.context.response.data,
    hasProperties({
      customerId: string(),
      firstName: string(),
      lastName: string(),
      email: string(),
      address: hasProperties({
        zipCode: string(),
        country: string(),
        state: string(),
        city: string(),
        streetAddress: string(),
      }),
    })
  );
});

Then('I receive a customerId for the new customer', function () {
  this.context.newCustomerId = this.context.response.data[0].customerId;
});

Then('I expect the response to have the new customerId', function () {
  assertThat(
    this.context.response.data.customerId,
    is(this.context.newCustomerId)
  );
});
