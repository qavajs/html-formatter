Feature: Logs

  Background:
    Given I open '$reportPage' url

  Scenario Outline: verify that user can open logs (<scenario>)
    When I click 'Main > Features Table > #LOGS in Rows > Name'
    And I click 'Feature > #<scenario> in Scenarios > Title'
    And I expect text of 'Feature > #<scenario> in Scenarios > #<step> in Steps > #<btn> of Attachments' to be equal 'Logs'
    And I click 'Feature > #<scenario> in Scenarios > #<step> in Steps > #<btn> of Attachments'
    And I expect text of 'Logs Overlay > Title' to be equal 'Logs'
    And I expect text of 'Logs Overlay > Text' to be equal '<data>'

    Examples:
      | scenario                  | step                 | btn | data                                                                    |
      | scenario passed with logs | passed step with log | 1   | some information in passed step\none more log line                      |
      | scenario failed with logs | failed step with log | 1   | some information in failed step\nER: expected result\nAR: actual result |
