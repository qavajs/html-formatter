Feature: Attachment

  Background:
    Given I open '$reportPage' url

  Scenario Outline: verify that user can open attachment (<scenario>)
    When I click 'Main > Features Table > #ATTACHMENT in Rows > Name'
    And I click 'Feature > #<scenario> in Scenarios > Title'
    And I expect text of 'Feature > #<scenario> in Scenarios > #Attachment in Steps > #1 of Attachments' to be equal '<mimeType>'
    And I click 'Feature > #<scenario> in Scenarios > #Attachment in Steps > #1 of Attachments'
    And I expect text of 'Attachment Overlay > Title' to be equal 'Attachment'
    And I expect 'src' attribute of 'Attachment Overlay > Image' to be equal 'data:<mimeType>;base64,<data>'

    Examples:
      | mimeType  | scenario             | data                 |
      | image/png | png base64           | {$pngBase64}         |
      | image/png | png full-size base64 | {$pngFullSizeBase64} |

  Scenario Outline: verify that user can open attachment (<scenario>)
    When I click 'Main > Features Table > #ATTACHMENT in Rows > Name'
    And I click 'Feature > #<scenario> in Scenarios > Title'
    And I expect text of 'Feature > #<scenario> in Scenarios > #Attachment in Steps > #1 of Attachments' to be equal '<mimeType>'
    And I click 'Feature > #<scenario> in Scenarios > #Attachment in Steps > #1 of Attachments'
    And I expect text of 'Attachment Overlay > Title' to be equal 'Attachment'
    And I expect 'src' attribute of 'Attachment Overlay > Iframe' to be equal 'data:<mimeType>;base64,<data>'

    Examples:
      | mimeType  | scenario | data          |
      | text/html | html     | {$htmlBase64} |

  Scenario Outline: verify that user can open attachment (<scenario>)
    When I click 'Main > Features Table > #ATTACHMENT in Rows > Name'
    And I click 'Feature > #<scenario> in Scenarios > Title'
    And I expect text of 'Feature > #<scenario> in Scenarios > #Attachment in Steps > #1 of Attachments' to be equal '<mimeType>'
    And I click 'Feature > #<scenario> in Scenarios > #Attachment in Steps > #1 of Attachments'
    And I expect text of 'Attachment Overlay > Title' to be equal 'Attachment'
    And I expect text of 'Attachment Overlay > Text' to be equal '<data>'

    Examples:
      | mimeType         | scenario      | data                     |
      | text/plain       | text          | multiline\ntext\ncontent |
      | text/plain       | string base64 | I\'m base 64 encoded text |
      | application/json | json          | $jsonText                |

  Scenario: verify that user can open any of multiple attachments
    When I click 'Main > Features Table > #ATTACHMENT in Rows > Name'
    And I click 'Feature > #multiple attachments in Scenarios > Title'
    And I click 'Feature > #multiple attachments in Scenarios > #multiple attachments in Steps > #1 of Attachments'
    And I expect text of 'Attachment Overlay > Title' to be equal 'Attachment'
    And I expect 'src' attribute of 'Attachment Overlay > Image' to be equal 'data:image/png;base64,{$pngBase64}'
    And I click 'Attachment Overlay > X'
    And I click 'Feature > #multiple attachments in Scenarios > #multiple attachments in Steps > #2 of Attachments'
    And I expect text of 'Attachment Overlay > Title' to be equal 'Attachment'
    And I expect 'src' attribute of 'Attachment Overlay > Image' to be equal 'data:image/png;base64,{$pngFullSizeBase64}'
