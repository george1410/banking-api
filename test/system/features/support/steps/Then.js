/* eslint-disable func-names */
const { Then } = require('@cucumber/cucumber');
const {
  assertThat,
  equalTo,
  hasProperties,
  string,
  everyItem,
} = require('hamjest');

Then('I expect the response to have status {int}', function (code) {
  assertThat(this.context.response.status, equalTo(code));
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
