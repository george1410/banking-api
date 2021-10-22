Feature: Customers

  Scenario: Get All Users
    Given I make a GET request to /customers
    Given I have a valid auth token
    When I receive a response
    Then I expect the response to have status 200
    And I expect the response to have status 400
