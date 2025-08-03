/////////////////////////////
// Tone.gs.txt
// CRUD functions for: ToneLibrary
// Protocols: SSP-GS-CRUD-BENCHMARK-01, SSP-CODESTRUCT-01
/////////////////////////////

/**
 * Adds a new tone entry to the ToneLibrary sheet.
 */
function addToneEntry(toneData) {
  var sheet = getSheetByName_("ToneLibrary");
  sheet.appendRow([
    toneData.toneID,
    toneData.toneName,
    toneData.description,
    toneData.samplePhrase,
    toneData.active
  ]);
}

/**
 * Retrieves a tone entry by Tone ID.
 */
function getToneEntryById(toneID) {
  var sheet = getSheetByName_("ToneLibrary");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === toneID) {
      var row = data[i];
      var entry = {};
      for (var j = 0; j < headers.length; j++) {
        entry[headers[j]] = row[j];
      }
      return entry;
    }
  }

  return null;
}

/**
 * Updates a tone entry by Tone ID.
 */
function updateToneEntryById(toneID, updatedData) {
  var sheet = getSheetByName_("ToneLibrary");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === toneID) {
      for (var j = 0; j < headers.length; j++) {
        var key = headers[j];
        if (updatedData.hasOwnProperty(key)) {
          sheet.getRange(i + 1, j + 1).setValue(updatedData[key]);
        }
      }
      return true;
    }
  }

  return false;
}

/**
 * Deletes a tone entry by Tone ID.
 */
function deleteToneEntryById(toneID) {
  var sheet = getSheetByName_("ToneLibrary");
  var data = sheet.getDataRange().getValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === toneID) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }

  return false;
}

/**
 * Lists all tone entries from the ToneLibrary sheet.
 */
function listAllToneEntries() {
  var sheet = getSheetByName_("ToneLibrary");
  var data = sheet.getDataRange().getValues();
  var headers = data[0];
  var entries = [];

  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var entry = {};
    for (var j = 0; j < headers.length; j++) {
      entry[headers[j]] = row[j];
    }
    entries.push(entry);
  }

  return entries;
}
