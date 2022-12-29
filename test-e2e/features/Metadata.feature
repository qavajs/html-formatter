Feature: Metadata

  Background:
    Given I open '$reportPage' url

  Scenario: verify that user can open failed page
    When I click 'Header > Metadata'
    Then I expect 'Metadata Overlay' to be visible
    And I expect text of 'Metadata Overlay > Title' to be equal 'Metadata'
    And I expect number of elements in 'Metadata Overlay > Rows' collection to be equal '2'
    And I expect text of 'Metadata Overlay > #1 of Rows > Key' to be equal 'OS'
    And I expect text of 'Metadata Overlay > #1 of Rows > Value' to be equal 'macos'
    And I expect text of 'Metadata Overlay > #2 of Rows > Key' to be equal 'OS Version'
    And I expect text of 'Metadata Overlay > #2 of Rows > Value' to be equal '13.1'
