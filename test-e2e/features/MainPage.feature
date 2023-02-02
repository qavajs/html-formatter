Feature: Main Page

  Background:
    Given I open '$reportPage' url

  Scenario: verify that user can open feature from main page clicking feature name
    When I click 'Main > Features Table > #FEATURE1 in Rows > Name'
    Then I expect text of 'Feature > Title' to equal 'Feature: Feature1'

  Scenario: verify that user can search by feature name on main page
    When I type 'datatable and' to 'Main > Search'
    Then I expect number of elements in 'Main > Features Table > Rows' collection to be equal '1'
    And I expect text of 'Main > Features Table > #1 of Rows > Name' to be equal 'DATATABLE AND MULTILINE'

  Scenario: verify that user can open failed page
    When I click 'Header > Failed'
    Then I expect number of elements in 'Failed > Features' collection to be equal '3'

  Scenario: verify that user can filter only failed on main page
    When I click 'Main > Show Only Failed'
    Then I expect number of elements in 'Main > Features Table > Rows' collection to be equal '3'

  Scenario: verify that user can filter only failed and search on main page
    When I click 'Main > Show Only Failed'
    Then I expect number of elements in 'Main > Features Table > Rows' collection to be equal '3'
    When I type 'feature2' to 'Main > Search'
    Then I expect number of elements in 'Main > Features Table > Rows' collection to be equal '1'
    And I expect text of 'Main > Features Table > #1 of Rows > Name' to be equal 'FEATURE2'

  Scenario: verify that filter state is saved
    When I click 'Main > Show Only Failed'
    Then I expect number of elements in 'Main > Features Table > Rows' collection to be equal '3'
    When I refresh page
    Then I expect number of elements in 'Main > Features Table > Rows' collection to be equal '3'

