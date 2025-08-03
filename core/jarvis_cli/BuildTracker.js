///////////////////////////////
// BuildTracker.gs
// CRUD functions for: Build_Phases
///////////////////////////////

/**
FIELD GUIDE — Build_Phases
Sheet Name: "Build_Phases"
Expected Headers:
- Date
- Phase
- Task
- Status
- Confirmed By
- Notes

Sample Object:
{
  "Date": "2025-06-08 08:45 EST",
  "Phase": "PH-003",
  "Task": "Initialize command sync",
  "Status": "In Progress",
  "Confirmed By": "Nova",
  "Notes": "Prepping KCC alignment"
}
*/

// === Shared Helper: Sheet Access ===
function getSheetByName_(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

// === Generate Next Unique Phase ID (PH-001, PH-002, ...) ===
function generateNextPhaseId(sheetName, idField) {
  var sheet = getSheetByName_(sheetName);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIndex = headers.indexOf(idField);
  if (idIndex === -1) throw new Error('Header "' + idField + '" not found.');

  var maxNum = 0;
  for (var i = 1; i < data.length; i++) {
    var cell = String(data[i][idIndex]);
    var match = cell.match(/^PH-(\d{3})$/);
    if (match) {
      var num = parseInt(match[1], 10);
      if (num > maxNum) {
        maxNum = num;
      }
    }
  }

  var nextNum = (maxNum + 1).toString().padStart(3, '0');
  return 'PH-' + nextNum;
}

// === ADD — Add New Phase (Auto ID) ===
function addPhaseAuto(entry) {
  var sheetName = "Build_Phases";
  var sheet = getSheetByName_(sheetName);
  var headersObj = getHeaderMap(sheetName);

  var proposedId = generateNextPhaseId(sheetName, "Phase");
  if (!isIdAvailable(sheetName, "Phase", proposedId)) {
    Logger.log('(X) ID "' + proposedId + '" already exists. Entry not added.');
    return;
  }

  entry["Phase"] = proposedId;
  entry["Date"] = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "yyyy-MM-dd HH:mm z");

  var newRow = Object.keys(headersObj).map(function(header) {
    return entry[header] || '';
  });

  sheet.appendRow(newRow);
  Logger.log('(✓) Phase "' + proposedId + '" added successfully.');
}

// === GET — Retrieve Phase Entry by ID ===
function getPhaseById(id) {
  var sheetName = "Build_Phases";
  var sheet = getSheetByName_(sheetName);
  var data = sheet.getDataRange().getValues();
  var headersObj = getHeaderMap(sheetName);
  var headers = Object.keys(headersObj);
  var idIndex = headers.indexOf("Phase");

  if (idIndex === -1) throw new Error('Header "Phase" not found.');

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]) === String(id)) {
      var row = data[i];
      var result = {};
      headers.forEach(function(header, j) {
        result[header] = row[j];
      });
      Logger.log(result);
      return result;
    }
  }

  Logger.log('(!) Phase ID "' + id + '" not found.');
  return null;
}

// === UPDATE — Update Phase Entry by ID ===
function updatePhaseById(id, updates) {
  var sheetName = "Build_Phases";
  var sheet = getSheetByName_(sheetName);
  var data = sheet.getDataRange().getValues();
  var headersObj = getHeaderMap(sheetName);
  var headers = Object.keys(headersObj);
  var idIndex = headers.indexOf("Phase");

  if (idIndex === -1) throw new Error('Header "Phase" not found.');

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]) === String(id)) {
      headers.forEach(function(header, j) {
        if (updates.hasOwnProperty(header)) {
          sheet.getRange(i + 1, j + 1).setValue(updates[header]);
        }
      });
      Logger.log('(✏️) Phase "' + id + '" updated successfully.');
      return;
    }
  }

  Logger.log('(!) Phase ID "' + id + '" not found. No update applied.');
}

// === DELETE — Delete Phase by ID ===
function deletePhaseById(id) {
  var sheetName = "Build_Phases";
  var sheet = getSheetByName_(sheetName);
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var idIndex = headers.indexOf("Phase");

  if (idIndex === -1) throw new Error('Header "Phase" not found in sheet.');

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]) === String(id)) {
      sheet.deleteRow(i + 1);
      Logger.log('(🗑️) Phase "' + id + '" deleted successfully.');
      return;
    }
  }

  Logger.log('(!) Phase ID "' + id + '" not found. Nothing deleted.');
}

// === LIST — Return All Phase Entries ===
function listPhases() {
  var sheetName = "Build_Phases";
  var sheet = getSheetByName_(sheetName);
  var data = sheet.getDataRange().getValues();
  var headersObj = getHeaderMap(sheetName);
  var headers = Object.keys(headersObj);
  var results = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var entry = {};
    headers.forEach(function(header, j) {
      entry[header] = row[j];
    });
    results.push(entry);
  }

  Logger.log(results);
  return results;
}

/*** TEST ONLY START ***/
// TEST CASES — BuildTracker.gs

/*
function testAddPhaseAuto() {
  var testEntry = {
    Task: "Initialize Operator Sync",
    Status: "In Progress",
    "Confirmed By": "Nova",
    Notes: "Set up phase command logic"
  };
  addPhaseAuto(testEntry);
}

function testGetPhaseById() {
  var testId = "PH-001";
  getPhaseById(testId);
}

function testUpdatePhaseById() {
  var testId = "PH-001";
  var updates = {
    Status: "Complete",
    Notes: "Phase finalized"
  };
  updatePhaseById(testId, updates);
}

function testDeletePhaseById() {
  var testId = "PH-001";
  deletePhaseById(testId);
}

function testListPhases() {
  listPhases();
}
*/
/*** TEST ONLY END ***/
