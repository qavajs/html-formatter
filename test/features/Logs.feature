Feature: Logs

  Scenario: scenario passed with logs
    When passed step with log

  Scenario: scenario failed with logs
    And failed step with log

  Scenario: scenario dollar replace
    And I expect 'some string' to match '^120$'

  Scenario: scenario passed with huge log
    When passed step with huge log
