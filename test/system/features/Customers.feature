Feature: Customers

  Scenario: Get all customers when none exist
    Given I make a GET request to /customers
    And I have a valid auth token
    When I receive a response
    Then I expect the response to have status 200
    And I expect the response to be an array containing 0 items

  Scenario: Create a single customer with all random data
    Given I make a POST request to /customers
    And I have a valid auth token
    When I receive a response
    Then I expect the response to have status 201
    And I expect the response to be an array containing 1 item