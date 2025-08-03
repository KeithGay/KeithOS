///////////////////////////////
// Agents.gs
// CRUD functions for: Agents_Roster
///////////////////////////////

/**
 * FIELD GUIDE — Agents_Roster
 * Sheet Name: "Agents_Roster"
 * Expected Headers:
 * - Agent Name
 * - Role
 * - Specialty
 * - Personality
 * - Assigned Systems
 * - Rules
 * - Gender
 * - Status
 * - Known Habit Drift
 * - Correction Protocol
 * - Last Evaluated
 * - Assigned Checkpoint
 * - Behavior Locked
 * 
 * Sample Object:
 * {
 *   "Agent Name": "Lyra",
 *   "Role": "Builder",
 *   "Specialty": "System Architecture",
 *   "Personality": "Direct, Structured",
 *   "Assigned Systems": "KeithOS, Jarvis OS",
 *   "Rules": "SSP-GS-CRUD-01, SSP-PROMPT-GUARD-01",
 *   "Gender": "Feminine",
 *   "Status": "Active",
 *   "Known Habit Drift": "None",
 *   "Correction Protocol": "Re-align with last benchmarked task",
 *   "Last Evaluated": "2025-06-08",
 *   "Assigned Checkpoint": "KCC Weekly Review",
 *   "Behavior Locked": "Yes"
 * }
 */

// === Shared Helper: Sheet Access ===
function getSheetByName_(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

// === ADD — Add New Agent (Manual ID) ===
function addAgentAuto(entry) {
  const sheetName = "Agents_Roster";
  const sheet = getSheetByName_(sheetName);
  const headersObj = getHeaderMap(sheetName);
  const headers = Object.keys(headersObj);

  const proposedId = entry["Agent Name"];
  if (!proposedId) {
    Logger.log("'Agent Name' is required.");
    return;
  }

  if (!isIdAvailable(sheetName, "Agent Name", proposedId)) {
    Logger.log("(X) Agent Name \"" + proposedId + "\" already exists. Entry not added.");
    return;
  }

  const newRow = headers.map(function(header) {
    return entry[header] || "";
  });

  sheet.appendRow(newRow);
  Logger.log("✅ Agent \"" + proposedId + "\" added successfully.");
}

// === GET — Retrieve Agent by Name ===
function getAgentById(id) {
  const sheetName = "Agents_Roster";
  const sheet = getSheetByName_(sheetName);
  const data = sheet.getDataRange().getValues();
  const headersObj = getHeaderMap(sheetName);
  const headers = Object.keys(headersObj);
  const idIndex = headers.indexOf("Agent Name");

  if (idIndex === -1) throw new Error('Header "Agent Name" not found.');

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

  Logger.log("⚠️ Agent Name \"" + id + "\" not found.");
  return null;
}

// === UPDATE — Update Agent Entry by Name ===
function updateAgentById(id, updates) {
  const sheetName = "Agents_Roster";
  const sheet = getSheetByName_(sheetName);
  const data = sheet.getDataRange().getValues();
  const headersObj = getHeaderMap(sheetName);
  const headers = Object.keys(headersObj);
  const idIndex = headers.indexOf("Agent Name");

  if (idIndex === -1) throw new Error('Header "Agent Name" not found.');

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]) === String(id)) {
      headers.forEach(function(header, j) {
        if (updates.hasOwnProperty(header)) {
          sheet.getRange(i + 1, j + 1).setValue(updates[header]);
        }
      });
      Logger.log("✏️ Agent \"" + id + "\" updated successfully.");
      return;
    }
  }

  Logger.log("⚠️ Agent Name \"" + id + "\" not found. No update applied.");
}

// === DELETE — Delete Agent by Name ===
function deleteAgentById(id) {
  const sheetName = "Agents_Roster";
  const sheet = getSheetByName_(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf("Agent Name");

  if (idIndex === -1) throw new Error('Header "Agent Name" not found in sheet.');

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]) === String(id)) {
      sheet.deleteRow(i + 1); // Adjust for header row
      Logger.log("🗑️ Agent \"" + id + "\" deleted successfully.");
      return;
    }
  }

  Logger.log("⚠️ Agent Name \"" + id + "\" not found. Nothing deleted.");
}

// === LIST — Return All Agents ===
function listAgents() {
  const sheetName = "Agents_Roster";
  const sheet = getSheetByName_(sheetName);
  const data = sheet.getDataRange().getValues();
  const headersObj = getHeaderMap(sheetName);
  const headers = Object.keys(headersObj);
  const results = [];

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

/*** TEST CASES — Commented Out for Safety
function testAddAgentAuto() {
  const testEntry = {
    "Agent Name": "Lisbeth",
    "Role": "Builder",
    "Specialty": "System Architecture",
    "Personality": "Direct, Structured",
    "Assigned Systems": "KeithOS, Jarvis OS",
    "Rules": "SSP-GS-CRUD-01, SSP-PROMPT-GUARD-01",
    "Gender": "Feminine",
    "Status": "Active",
    "Known Habit Drift": "None",
    "Correction Protocol": "Re-align with last benchmarked task",
    "Last Evaluated": "2025-06-08",
    "Assigned Checkpoint": "KCC Weekly Review",
    "Behavior Locked": "Yes"
  };
  addAgentAuto(testEntry);
}

function testGetAgentById() {
  getAgentById("Lyra");
}

function testUpdateAgentById() {
  const updates = {
    "Status": "Standby",
    "Notes": "Monitoring tone enforcement stability"
  };
  updateAgentById("Lisbeth", updates);
}

function testDeleteAgentById() {
  deleteAgentById("Lyra");
}

function testListAgents() {
  listAgents();
}
***/ 
