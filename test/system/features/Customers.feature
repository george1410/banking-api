Feature: Customers
  Background: Clean Slate
    Given I have not created any data

  Scenario: Get all customers when none exist
    Given I have a valid auth token
    When I make a GET request to /customers
    Then I expect the response to have status 200
    And I expect the response to be an array containing 0 items

  Scenario: Create a single customer with all random data
    Given I have a valid auth token
    When I make a POST request to /customers
    Then I expect the response to have status 201
    And I expect the response to be an array containing 1 item
    And I expect each item to be a valid customer object

  Scenario: Create multiple customers with all random data
    Given I have a valid auth token
    And I set the quantity parameter to 5
    When I make a POST request to /customers
    Then I expect the response to have status 201
    And I expect the response to be an array containing 5 items
    And I expect each item to be a valid customer object
