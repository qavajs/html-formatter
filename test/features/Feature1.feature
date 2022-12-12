Feature: Feature1

  Background:
    Given background

  Scenario: scenario passed
    When passed step

  Scenario: scenario failed
    When passed step
    And failed step

  Scenario: scenario undefined
    When passed step
    And undefined step

  Scenario: scenario ambiguous
    When passed step
    And ambiguous step

  Scenario: scenario pending
    When passed step
    And pending step
