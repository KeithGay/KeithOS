/////////////////////////////
// KnowledgeBase.gs
// CRUD functions for: Known_Limitations
/////////////////////////////

/*
FIELD GUIDE — Known_Limitations
---------------------------------------
Sheet Name: "Known_Limitations"

Expected Headers:
- Limitation ID
- Type
- Description
- Impact
- Workaround
- Notes

Sample Object:
{
  "Limitation ID": "LIM-001",
  "Type": "Memory",
  "Description": "GPT memory fails to retain sheet schema reliably across sessions.",
  "Impact": "Requires repeated revalidation and user reentry of known schema formats.",
  "Workaround": "Use Format_Registry sheet to enforce structure references.",
  "Notes": "Escalated to permanent log structure."
}
*/

// Sheet helper (comment out if using global getSheetByName_)
function getSheetByName_(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

// VALIDATION — Check if Limitation ID is already used
function isLimitationIdAvailable(id) {
  var sheet = getSheetByName_('Known_Limitations');
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  return !data.flat().includes(id);
}

// ADD — Create a new limitation record
function addKnownLimitation(limitationData) {
  var sheet = getSheetByName_('Known_Limitations');
  var headerMap = getHeaderMap('Known_Limitations');
  var row = new Array(Object.keys(headerMap).length).fill("");

  for (var key in limitationData) {
    if (headerMap.hasOwnProperty(key)) {
      row[headerMap[key]] = limitationData[key];
    }
  }

  sheet.appendRow(row);
}

// GET — Retrieve limitation by ID
function getKnownLimitationById(id) {
  var sheet = getSheetByName_('Known_Limitations');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      var row = data[i];
      var entry = {};
      headers.forEach(function(header, index) {
        entry[header] = row[index];
      });
      return entry;
    }
  }

  return null;
}

// UPDATE — Modify a limitation entry by ID
function updateKnownLimitationById(id, updatedData) {
  var sheet = getSheetByName_('Known_Limitations');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var headerMap = getHeaderMap('Known_Limitations');

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      for (var key in updatedData) {
        if (headerMap.hasOwnProperty(key)) {
          var col = headerMap[key] + 1;
          sheet.getRange(i + 1, col).setValue(updatedData[key]);
        }
      }
      return true;
    }
  }

  return false;
}

// DELETE — Remove a limitation entry by ID
function deleteKnownLimitationById(id) {
  var sheet = getSheetByName_('Known_Limitations');
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === id) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }

  return false;
}

// LIST — Return all known limitations
function listAllKnownLimitations() {
  var sheet = getSheetByName_('Known_Limitations');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var entries = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var entry = {};
    headers.forEach(function(header, index) {
      entry[header] = row[index];
    });
    entries.push(entry);
  }

  return entries;
}

/*** TEST ONLY START ***/
// =====================
// TEST CASES — KnowledgeBase.gs
// =====================

/*
function testAddKnownLimitation() {
  addKnownLimitation({
    "Limitation ID": "LIM-TEST-001",
    "Type": "Workflow",
    "Description": "Cannot auto-persist column order across dynamic sheets.",
    "Impact": "Forces manual header normalization.",
    "Workaround": "Run normalizeFormatRegistry() as needed.",
    "Notes": "Added during unit test."
  });
}

function testGetKnownLimitation() {
  Logger.log(getKnownLimitationById("LIM-TEST-001"));
}

function testUpdateKnownLimitation() {
  var success = updateKnownLimitationById("LIM-TEST-001", {
    "Impact": "Updated impact value",
    "Notes": "Note updated successfully via test function"
  });
  Logger.log("Update success? " + success);
}

function testDeleteKnownLimitation() {
  var deleted = deleteKnownLimitationById("LIM-TEST-001");
  Logger.log("Deleted? " + deleted);
}

function testListAllKnownLimitations() {
  Logger.log(listAllKnownLimitations());
}
*/
/*** TEST ONLY END ***/
