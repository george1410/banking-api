const { Then } = require('@cucumber/cucumber');
const { assertThat, equalTo } = require('hamjest');

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
