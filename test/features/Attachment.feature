@attachment
Feature: Attachments

  Background:
    Given background

  Scenario: text
    When text attachment

  Scenario: string base64
    When text base64 attachment

  Scenario: png base64
    When png base64 attachment

  Scenario: png full-size base64
    When png full-size base64 attachment

  Scenario: json
    When json attachment

  Scenario: html
    When html base64 attachment

  Scenario: multiple attachments
    When multiple attachments

  Scenario: unsupported attachments
    When unsupported base64 attachment

  Scenario: named attachment
    When named attachment
