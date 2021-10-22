Feature: Authentication
  As a User
  I want requests without a valid auth token to be rejected
  So that nobody else can modify the data I have created

  Scenario Outline: Request without Authorization header
    Given I make an unauthorized <method> request to <endpoint>
    When I receive a response
    Then I expect the response to have status 401
    And I expect the response to have json body
      """
      {
        "message": "Unauthorized"
      }
      """

      Scenarios:
      | method | endpoint                     |
      | GET    | /customers                   |
      | GET    | /customers/12345             |
      | POST   | /customers                   |
      | GET    | /customers/12345/accounts    |
      | GET    | /accounts/12345              |
      | POST   | /customers/12345/accounts    |
      | DELETE | /accounts/12345              |
      | DELETE | /customers/12345/accounts    |
      | GET    | /accounts/12345/transactions |
      | GET    | /transactions/12345          |
      | POST   | /accounts/12345/transactions |

  Scenario Outline: Request with invalid auth token
    Given I make a <method> request with invalid token to <endpoint>
    When I receive a response
    Then I expect the response to have status 401
    And I expect the response to have json body
      """
      {
        "message": "Unauthorized"
      }
      """

      Scenarios:
      | method | endpoint                     |
      | GET    | /customers                   |
      | GET    | /customers/12345             |
      | POST   | /customers                   |
      | GET    | /customers/12345/accounts    |
      | GET    | /accounts/12345              |
      | POST   | /customers/12345/accounts    |
      | DELETE | /accounts/12345              |
      | DELETE | /customers/12345/accounts    |
      | GET    | /accounts/12345/transactions |
      | GET    | /transactions/12345          |
      | POST   | /accounts/12345/transactions |
