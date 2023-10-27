Feature: Execution Time

  Background:
    Given I open '$reportPage' url
    When I click 'Main > Features Table > #FEATURE1 in Rows > Name'
    Then I expect text of 'Feature > Title' to equal 'Feature: Feature1'

  Scenario: verify that scenario have execution time
    Then I expect text of 'Feature > #1 of Scenarios > Time' to match '^\d+\.\d{2}s$'
    When I click 'Feature > #1 of Scenarios'
    Then I expect text of 'Feature > #1 of Scenarios > #1 of Steps > Time' to match '^\d+\.\d{2}s$'

