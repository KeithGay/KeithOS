/////////////////////////////
// Journal.gs
// CRUD functions for: Session_Journal
/////////////////////////////

/*
FIELD GUIDE — Session_Journal
---------------------------------------
Sheet Name: "Session_Journal"

Expected Headers:
- Date
- Summary
- Key Decisions
- Changes Logged
- SaveState ID
- Notes

Sample Object:
{
  "Date": "2025-06-07",
  "Summary": "One-shot test pass",
  "Key Decisions": "Protocol merge confirmed",
  "Changes Logged": "FormatRegistry logic finalized",
  "SaveState ID": "CRUD-01",
  "Notes": "Note updated successfully via test function"
}
*/

// Sheet helper (comment this out if using global getSheetByName_ from Main.gs)
function getSheetByName_(name) {
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(name);
}

// VALIDATION — Check if date already exists
function isSessionDateAvailable(date) {
  var sheet = getSheetByName_('Session_Journal');
  var data = sheet.getRange(2, 1, sheet.getLastRow() - 1, 1).getValues();
  return !data.flat().includes(date);
}

// ADD — Add new journal entry
function addJournalEntry(entryData) {
  var sheet = getSheetByName_('Session_Journal');
  var headerMap = getHeaderMap('Session_Journal');
  var row = new Array(Object.keys(headerMap).length).fill("");

  for (var key in entryData) {
    if (headerMap.hasOwnProperty(key)) {
      row[headerMap[key]] = entryData[key];
    }
  }

  sheet.appendRow(row);
}

// GET — Retrieve journal entry by Date
function getJournalEntryByDate(targetDate) {
  var sheet = getSheetByName_('Session_Journal');
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  for (var i = 1; i < data.length; i++) {
    var rowDate = Utilities.formatDate(new Date(data[i][0]), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    if (rowDate === targetDate) {
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

// UPDATE — Modify journal entry by Date
function updateJournalEntryByDate(targetDate, updatedData) {
  var sheet = getSheetByName_('Session_Journal');
  var displayData = sheet.getDataRange().getDisplayValues();
  var headers = displayData[0];
  var headerMap = getHeaderMap('Session_Journal');

  for (var i = 1; i < displayData.length; i++) {
    var rowDate = displayData[i][0];
    if (rowDate === targetDate) {
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

// DELETE — Remove journal entry by Date
function deleteJournalEntryByDate(targetDate) {
  var sheet = getSheetByName_('Session_Journal');
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    var rowDate = Utilities.formatDate(new Date(data[i][0]), Session.getScriptTimeZone(), 'yyyy-MM-dd');
    if (rowDate === targetDate) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }

  return false;
}

// LIST — Return all journal entries
function listAllJournalEntries() {
  var sheet = getSheetByName_('Session_Journal');
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
// TEST CASES — Journal.gs
// =====================

/*
function testAddJournalEntry() {
  addJournalEntry({
    "Date": "2025-06-07",
    "Summary": "One-shot test pass",
    "Key Decisions": "Protocol merge confirmed",
    "Changes Logged": "FormatRegistry logic finalized",
    "SaveState ID": "CRUD-01",
    "Notes": "Note updated successfully via test function"
  });
}

function testGetJournalEntry() {
  Logger.log(getJournalEntryByDate("2025-06-07"));
}

function testUpdateJournalEntry() {
  var updated = updateJournalEntryByDate("2025-06-07", {
    "Notes": "Note updated with date-normalization fix"
  });
  Logger.log("Update success? " + updated);
}

function testDeleteJournalEntry() {
  Logger.log(deleteJournalEntryByDate("2025-06-07"));
}

function testListAllJournalEntries() {
  Logger.log(listAllJournalEntries());
}
*/
/*** TEST ONLY END ***/
