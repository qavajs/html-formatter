Feature: Flaky

  Scenario: scenario passed on retry
    When passed step
    And flaky step

  Scenario Outline: scenario outline <value>
    When passed step

    Examples:
      | value |
      | one   |
      | two   |
