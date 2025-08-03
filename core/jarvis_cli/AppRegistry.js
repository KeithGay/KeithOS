///////////////////////////////
// AppRegistry.gs
// CRUD functions for: App_Index
///////////////////////////////

/**
📌 FIELD GUIDE — App_Index
Sheet Name: "App_Index"
Expected Headers:
- App Name
- Type
- Category
- Status
- SaveState Tab
- Notes

Sample Object:
{
  "App Name": "LeadVista",
  "Type": "Standalone App",
  "Category": "Internal Tool",
  "Status": "✅ Active",
  "SaveState Tab": "SaveState_LeadVista",
  "Notes": "CRM-focused module"
}
*/

// === Shared Helper: Sheet Access ===
function getSheetByName_(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

// === ADD — Add New App Entry ===
function addAppAuto(entry) {
  const sheetName = "App_Index";
  const sheet = getSheetByName_(sheetName);
  const headersObj = getHeaderMap(sheetName);
  const headers = Object.keys(headersObj);

  const proposedId = entry["App Name"];
  if (!proposedId) {
    Logger.log("'App Name' is required.");
    return;
  }

  if (!isIdAvailable(sheetName, "App Name", proposedId)) {
    Logger.log('(X) App Name "' + proposedId + '" already exists. Entry not added.');
    return;
  }

  Logger.log("Headers: " + headers.join(", "));
  Logger.log("Entry: " + JSON.stringify(entry));

  const newRow = headers.map(function(header) {
    return entry[header] ? entry[header] : '';
  });

  sheet.appendRow(newRow);
  Logger.log('✅ App "' + proposedId + '" added successfully.');
}

// === GET — Retrieve App Entry by Name ===
function getAppById(id) {
  const sheetName = "App_Index";
  const sheet = getSheetByName_(sheetName);
  const data = sheet.getDataRange().getValues();
  const headersObj = getHeaderMap(sheetName);
  const headers = Object.keys(headersObj);
  const idIndex = headers.indexOf("App Name");

  if (idIndex === -1) throw new Error('Header "App Name" not found.');

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]) === String(id)) {
      const row = data[i];
      var result = {};
      for (var j = 0; j < headers.length; j++) {
        result[headers[j]] = row[j];
      }
      Logger.log(result);
      return result;
    }
  }

  Logger.log('⚠️ App Name "' + id + '" not found.');
  return null;
}

// === UPDATE — Update App Entry by Name ===
function updateAppById(id, updates) {
  const sheetName = "App_Index";
  const sheet = getSheetByName_(sheetName);
  const data = sheet.getDataRange().getValues();
  const headersObj = getHeaderMap(sheetName);
  const headers = Object.keys(headersObj);
  const idIndex = headers.indexOf("App Name");

  if (idIndex === -1) throw new Error('Header "App Name" not found.');

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]) === String(id)) {
      for (var j = 0; j < headers.length; j++) {
        if (updates.hasOwnProperty(headers[j])) {
          sheet.getRange(i + 1, j + 1).setValue(updates[headers[j]]);
        }
      }
      Logger.log('✏️ App "' + id + '" updated successfully.');
      return;
    }
  }

  Logger.log('⚠️ App Name "' + id + '" not found. No update applied.');
}

// === DELETE — Delete App by Name ===
function deleteAppById(id) {
  const sheetName = "App_Index";
  const sheet = getSheetByName_(sheetName);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf("App Name");

  if (idIndex === -1) throw new Error('Header "App Name" not found in sheet.');

  for (var i = 1; i < data.length; i++) {
    if (String(data[i][idIndex]) === String(id)) {
      sheet.deleteRow(i + 1);
      Logger.log('🗑️ App "' + id + '" deleted successfully.');
      return;
    }
  }

  Logger.log('⚠️ App Name "' + id + '" not found. Nothing deleted.');
}

// === LIST — Return All Apps ===
function listApps() {
  const sheetName = "App_Index";
  const sheet = getSheetByName_(sheetName);
  const data = sheet.getDataRange().getValues();
  const headersObj = getHeaderMap(sheetName);
  const headers = Object.keys(headersObj);
  const results = [];

  for (var i = 1; i < data.length; i++) {
    const row = data[i];
    var entry = {};
    for (var j = 0; j < headers.length; j++) {
      entry[headers[j]] = row[j];
    }
    results.push(entry);
  }

  Logger.log(results);
  return results;
}

/*** TEST ONLY START ***/
// 🧪 TEST CASES — AppRegistry.gs

/*
function testAddAppAuto() {
  const testEntry = {
    "App Name": "LeadVista",
    Type: "Standalone App",
    Category: "Internal Tool",
    Status: "✅ Active",
    "SaveState Tab": "SaveState_LeadVista",
    Notes: "CRM-focused module"
  };
  addAppAuto(testEntry);
}

function testGetAppById() {
  const testId = "LeadVista";
  getAppById(testId);
}

function testUpdateAppById() {
  const testId = "LeadVista";
  const updates = {
    Status: "🛠️ In Progress",
    Notes: "Updating for Alpha phase"
  };
  updateAppById(testId, updates);
}

function testDeleteAppById() {
  const testId = "LeadVista";
  deleteAppById(testId);
}

function testListApps() {
  listApps();
}
*/
/*** TEST ONLY END ***/
