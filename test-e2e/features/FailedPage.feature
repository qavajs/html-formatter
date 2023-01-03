Feature: Failed Page

  Background:
    Given I open '$reportPage' url
    And I click 'Header > Failed'

  Scenario: verify that user can search by scenario name on failed page
    When I type 'second' to 'Failed > Search'
    Then I expect number of elements in 'Failed > Features' collection to be equal '1'
    And I expect text of 'Failed > #1 of Features > Title' to be equal 'Feature: Feature2'
    And I expect text of 'Failed > #1 of Features > #1 of Scenarios > Title' to be equal 'Scenario: second scenario failed in feature 2'
