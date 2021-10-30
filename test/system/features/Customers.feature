Feature: Customers
  Background: Authorized user with no existing data
    Given I have not created any data
    Given I have a valid auth token

  Scenario: Get all customers when none exist
    When I make a GET request to /customers
    Then I expect the response to have status 200
    And I expect the response to be an array containing 0 items

  Scenario: Get customer by ID it doesn't exist
    When I make a GET request to /customers/12345
    Then I expect the response to have status 404
    And I expect the response to be empty

  Scenario: Create a single customer with all random data
    When I make a POST request to /customers
    Then I expect the response to have status 201
    And I expect the response to be an array containing 1 item
    And I expect each item to be a valid customer object

  Scenario: Create multiple customers with all random data
    Given I set the quantity parameter to 5
    When I make a POST request to /customers
    Then I expect the response to have status 201
    And I expect the response to be an array containing 5 items
    And I expect each item to be a valid customer object

  Scenario: Create a customer and then get that customer by ID
    When I make a POST request to /customers
    Then I receive a customerId for the new customer
    When I make a GET request to /customers/customerId with the new customerId
    Then I expect the response to have status 200
    And I expect the response to be a valid customer object
    And I expect the response to have the new customerId
