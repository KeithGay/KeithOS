/////////////////////////////
// Playbook.gs
// CRUD functions for: KeithOS_Playbook
/////////////////////////////

/*
📌 FIELD GUIDE — Playbook
---------------------------------------
Sheet Name: "KeithOS_Playbook"

Expected Headers:
- Rule ID
- Prompt Type
- Usage Scenario
- Instruction
- Example
- Notes

Sample Object:
{
  "Rule ID": "SSP-GS-CRUD-01",
  "Prompt Type": "System Protocol",
  "Usage Scenario": "App Script (CRUD) Functions",
  "Instruction": "Follow standard App Script formatting...",
  "Example": "// AppRegistry.gs CRUD block...",
  "Notes": "Required for all core modules"
}
*/

// 🧪 TEST-ONLY HELPER: getSheetByName_()
// Comment out this block when using Main.gs globally
function getSheetByName_(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

/**
 * Checks if a Rule ID is available (not already used).
 * @param {string} ruleId
 * @returns {boolean}
 */
function isRuleIdAvailable(ruleId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('KeithOS_Playbook');
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues(); // Column 1: Rule ID
  return !data.flat().includes(ruleId);
}

/**
 * Adds a new rule to KeithOS_Playbook.
 * @param {Object} ruleData
 * @returns {string}
 */
function addPlaybookRule(ruleData) {
  var sheet = getSheetByName_('KeithOS_Playbook');
  var headerMap = getHeaderMap('KeithOS_Playbook');
  var row = new Array(Object.keys(headerMap).length).fill("");

  for (var key in ruleData) {
    if (headerMap.hasOwnProperty(key)) {
      row[headerMap[key]] = ruleData[key];
    }
  }

  sheet.appendRow(row);
  return "✅ Protocol logged: " + (ruleData["Rule ID"] || "(no ID)");
}

/**
 * Retrieves a rule by Rule ID.
 * @param {string} ruleId
 * @returns {Object|null}
 */
function getPlaybookRuleById(ruleId) {
  var sheet = getSheetByName_('KeithOS_Playbook');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === ruleId) {
      var row = data[i];
      var rule = {};
      headers.forEach(function(header, index) {
        rule[header] = row[index];
      });
      return rule;
    }
  }

  return null;
}

/**
 * Updates an existing rule by Rule ID.
 * @param {string} ruleId
 * @param {Object} updatedData
 * @returns {boolean}
 */
function updatePlaybookRuleById(ruleId, updatedData) {
  var sheet = getSheetByName_('KeithOS_Playbook');
  var data = sheet.getDataRange().getValues();
  var headerMap = getHeaderMap('KeithOS_Playbook');

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === ruleId) {
      for (var key in updatedData) {
        if (headerMap.hasOwnProperty(key)) {
          var col = headerMap[key] + 1; // 1-based
          sheet.getRange(i + 1, col).setValue(updatedData[key]);
        }
      }
      return true;
    }
  }

  return false;
}

/**
 * Deletes a rule from KeithOS_Playbook by Rule ID.
 * @param {string} ruleId
 * @returns {boolean}
 */
function deletePlaybookRuleById(ruleId) {
  var sheet = getSheetByName_('KeithOS_Playbook');
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === ruleId) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }

  return false;
}

/**
 * Lists all rules from KeithOS_Playbook.
 * @returns {Array}
 */
function listAllPlaybookRules() {
  var sheet = getSheetByName_('KeithOS_Playbook');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var rules = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var rule = {};
    headers.forEach(function(header, index) {
      rule[header] = row[index];
    });
    rules.push(rule);
  }

  return rules;
}

/*** TEST ONLY START ***/
// =====================
// 🧪 TEST CASES — Playbook.gs
// =====================

/*
function testAddPlaybookRule() {
  addPlaybookRule({
    "Rule ID": "SSP-KCC-STYLE-01",
    "Prompt Type": "System Protocol",
    "Usage Scenario": "KCC Styling Conventions",
    "Instruction": "Use pixel fonts and neon-accent themes...",
    "Example": "<div class='crt-theme'>...</div>",
    "Notes": "Confirmed during session 6/6/2025"
  });
}

function testGetPlaybookRule() {
  Logger.log(getPlaybookRuleById("SSP-KCC-STYLE-01"));
}

function testUpdatePlaybookRule() {
  var result = updatePlaybookRuleById("SSP-KCC-STYLE-01", {
    "Notes": "✅ Verified 6/7/2025 — style logic enforced"
  });
  Logger.log("Update success? " + result);
}

function testDeletePlaybookRule() {
  var result = deletePlaybookRuleById("SSP-KCC-STYLE-01");
  Logger.log("Delete success? " + result);
}

function testListAllPlaybookRules() {
  Logger.log(listAllPlaybookRules());
}
*/

/*** TEST ONLY END ***/
