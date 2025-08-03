//////////////////////////////////////////////////////////
// RETRO BOOST ARCADE (CRUD)
// Sheet Name: SaveState_RetroBoostArcade
// Protocols: SSP-GS-CRUD-BENCHMARK-01, SSP-CODESTRUCT-01 to 03
//////////////////////////////////////////////////////////

// 📌 FIELD GUIDE
// Sheet: SaveState_RetroBoostArcade
// Headers:
// Session ID, App, Module, Start Time, End Time, Status, Notes,
// System Name, Type, Assigned Agents, Tracks, Tone Protocol,
// Module Components, Unique Rules, UI Notes, Session Output Format,
// Prompt Format, Version Tag, Live Code Reference, Last Checkpoint,
// Last UI Stage, Resume Required, Save Trigger, Last Updated, XP Earned, Streak

// Example Entry:
// {
//   "Session ID": "RB-SESSION-001",
//   "App": "Retro Boost Arcade",
//   "Module": "Classic Mode",
//   ...
// }

// ========== UTILITIES ==========

function getHeaderMap(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var headers = sheet.getDataRange().getValues()[0];
  var map = {};
  for (var i = 0; i < headers.length; i++) {
    map[headers[i]] = i;
  }
  return map;
}

function getNextRetroBoostId() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SaveState_RetroBoostArcade");
  var data = sheet.getDataRange().getValues();
  var max = 0;

  for (var i = 1; i < data.length; i++) {
    var id = data[i][0];
    if (id && id.indexOf("RB-SESSION-") === 0) {
      var num = parseInt(id.replace("RB-SESSION-", ""), 10);
      if (!isNaN(num) && num > max) {
        max = num;
      }
    }
  }

  var next = max + 1;
  return "RB-SESSION-" + ("000" + next).slice(-3);
}

// ========== ADD ==========

function addRetroBoostEntry(entry) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SaveState_RetroBoostArcade");
  var headers = getHeaderMap("SaveState_RetroBoostArcade");
  var row = new Array(Object.keys(headers).length).fill("");

  var sessionId = getNextRetroBoostId();
  entry["Session ID"] = sessionId;
  entry["Last Updated"] = new Date();

  for (var key in entry) {
    if (headers.hasOwnProperty(key)) {
      row[headers[key]] = entry[key];
    }
  }

  sheet.appendRow(row);
  Logger.log("✅ RetroBoost session added: " + sessionId);
  return sessionId;
}

// ========== GET ==========

function getRetroBoostById(sessionId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SaveState_RetroBoostArcade");
  var data = sheet.getDataRange().getValues();
  var headers = getHeaderMap("SaveState_RetroBoostArcade");

  for (var i = 1; i < data.length; i++) {
    if (data[i][headers["Session ID"]] === sessionId) {
      var obj = {};
      for (var header in headers) {
        obj[header] = data[i][headers[header]];
      }
      return obj;
    }
  }

  return null;
}

// ========== UPDATE ==========

function updateRetroBoostField(sessionId, field, value) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SaveState_RetroBoostArcade");
  var data = sheet.getDataRange().getValues();
  var headers = getHeaderMap("SaveState_RetroBoostArcade");

  for (var i = 1; i < data.length; i++) {
    if (data[i][headers["Session ID"]] === sessionId) {
      sheet.getRange(i + 1, headers[field] + 1).setValue(value);
      sheet.getRange(i + 1, headers["Last Updated"] + 1).setValue(new Date());
      Logger.log("✏️ Updated " + field + " for session " + sessionId);
      return true;
    }
  }

  return false;
}

// ========== DELETE ==========

function deleteRetroBoostEntry(sessionId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SaveState_RetroBoostArcade");
  var data = sheet.getDataRange().getValues();
  var headers = getHeaderMap("SaveState_RetroBoostArcade");

  for (var i = 1; i < data.length; i++) {
    if (data[i][headers["Session ID"]] === sessionId) {
      sheet.deleteRow(i + 1);
      Logger.log("🗑️ Deleted session " + sessionId);
      return true;
    }
  }

  return false;
}

// ========== LIST ALL ==========

function listAllRetroBoostSessions() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("SaveState_RetroBoostArcade");
  var data = sheet.getDataRange().getValues();
  var headers = getHeaderMap("SaveState_RetroBoostArcade");
  var results = [];

  for (var i = 1; i < data.length; i++) {
    var obj = {};
    for (var header in headers) {
      obj[header] = data[i][headers[header]];
    }
    results.push(obj);
  }

  return results;
}

// ========== TESTS (Optional) ==========

/*
function testAddRetroBoost() {
  var id = addRetroBoostEntry({
    "App": "Retro Boost Arcade",
    "Module": "Classic Mode",
    "Start Time": "2025-06-14 12:30",
    "End Time": "2025-06-14 12:55",
    "Status": "In Progress",
    "Notes": "Demo session created during cleanup",
    "System Name": "Retro Boost Arcade",
    "Type": "XP App",
    "Assigned Agents": "Lyra, Ledger",
    "Tracks": "Trivia Engine, Score Tracker",
    "Tone Protocol": "Arcade-themed, upbeat",
    "Module Components": "Classic Mode, Endless Mode",
    "Unique Rules": "Streak logic only; no penalties",
    "UI Notes": "Pixel fonts, modal layout",
    "Session Output Format": "XP + Score",
    "Prompt Format": "Retro-themed trivia, 4 choices",
    "Version Tag": "Alpha-1.0",
    "Live Code Reference": "KeithOS/SaveStates/RetroBoostArcade",
    "Last Checkpoint": "Round 2",
    "Last UI Stage": "CRT Modal Active",
    "Resume Required": "No",
    "Save Trigger": "Manual Save",
    "XP Earned": "75",
    "Streak": "2"
  });

  Logger.log("Created: " + id);
}
*/

