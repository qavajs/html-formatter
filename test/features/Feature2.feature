@feature_tag
Feature: Feature2

  Background:
    Given background

  @scenario_tag
  Scenario: scenario passed
    When passed step

  Scenario: scenario failed
    When passed step
    And failed step
