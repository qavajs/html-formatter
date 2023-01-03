Feature: Feature Page

  Background:
    Given I open '$reportPage' url
    When I click 'Main > Features Table > #FEATURE1 in Rows > Name'
    Then I expect text of 'Feature > Title' to equal 'Feature: Feature1'

  Scenario: verify that user can search by scenario name on feature page
    When I type 'pending' to 'Feature > Search'
    Then I expect number of elements in 'Feature > Scenarios' collection to be equal '1'
    And I expect text of 'Feature > #1 of Scenarios > Title' to be equal 'Scenario: scenario pending'

  Scenario: verify that user can filter only failed on feature page
    When I click 'Feature > Show Only Failed'
    Then I expect number of elements in 'Feature > Scenarios' collection to be equal '1'
    And I expect text of 'Feature > #1 of Scenarios > Title' to be equal 'Scenario: scenario failed'

  Scenario: verify that filter state is saved
    When I click 'Feature > Show Only Failed'
    Then I expect number of elements in 'Feature > Scenarios' collection to be equal '1'
    And I expect text of 'Feature > #1 of Scenarios > Title' to be equal 'Scenario: scenario failed'
    When I refresh page
    Then I expect number of elements in 'Feature > Scenarios' collection to be equal '1'
    And I expect text of 'Feature > #1 of Scenarios > Title' to be equal 'Scenario: scenario failed'
