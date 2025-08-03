///////////////////////////////
// QueueSystem.gs
// CRUD functions for: Agent_Queues
///////////////////////////////

/*
📌 FIELD GUIDE — Agent_Queues
---------------------------------------
Sheet Name: "Agent_Queues"

Expected Headers:
- Agent ID
- Agent Name
- Agent Role
- Task ID
- Task Description
- Status
- Priority
- Last Updated
- Notes

Sample Object:
{
  "Agent ID": "Lyra",
  "Agent Name": "Lyra",
  "Agent Role": "System Operator",
  "Task ID": "TASK-123",
  "Task Description": "Update SaveState for Mailer XP",
  "Status": "Queued",
  "Priority": "High",
  "Last Updated": "2025-06-08T10:03:00.000Z",
  "Notes": "Critical system sync"
}
*/


// ========== CRUD: ADD ==========

function addAgentQueue(entry) {
  var sheetName = "Agent_Queues";
  var sheet = getSheetByName_(sheetName);
  var headerMap = getHeaderMap(sheetName);
  var orderedHeaders = Object.keys(headerMap).sort(function(a, b) {
    return headerMap[a] - headerMap[b];
  });
  var row = [];

  for (var i = 0; i < orderedHeaders.length; i++) {
    var header = orderedHeaders[i];
    row.push(entry[header] || "");
  }

  sheet.appendRow(row);
}


// ========== CRUD: GET ONE ==========

function getAgentQueueEntryByRow(rowNum) {
  var sheet = getSheetByName_("Agent_Queues");
  var data = sheet.getRange(rowNum, 1, 1, sheet.getLastColumn()).getValues()[0];
  var headerMap = getHeaderMap("Agent_Queues");
  var orderedHeaders = Object.keys(headerMap).sort(function(a, b) {
    return headerMap[a] - headerMap[b];
  });

  var entry = {};
  for (var i = 0; i < orderedHeaders.length; i++) {
    entry[orderedHeaders[i]] = data[i];
  }

  return entry;
}


// ========== CRUD: LIST ALL ==========

function listAgentQueueEntries() {
  var sheet = getSheetByName_("Agent_Queues");
  var data = sheet.getDataRange().getValues();
  var headerMap = getHeaderMap("Agent_Queues");
  var orderedHeaders = Object.keys(headerMap).sort(function(a, b) {
    return headerMap[a] - headerMap[b];
  });

  var entries = [];
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var entry = {};
    for (var j = 0; j < orderedHeaders.length; j++) {
      entry[orderedHeaders[j]] = row[j];
    }
    entries.push(entry);
  }

  return entries;
}


// ========== CRUD: UPDATE ==========

function updateAgentQueueEntryByRow(rowNum, updatedFields) {
  var sheetName = "Agent_Queues";
  var sheet = getSheetByName_(sheetName);
  var headerMap = getHeaderMap(sheetName);
  var orderedHeaders = Object.keys(headerMap).sort(function(a, b) {
    return headerMap[a] - headerMap[b];
  });

  var range = sheet.getRange(rowNum, 1, 1, orderedHeaders.length);
  var row = range.getValues()[0];

  for (var i = 0; i < orderedHeaders.length; i++) {
    var header = orderedHeaders[i];
    if (updatedFields.hasOwnProperty(header)) {
      row[i] = updatedFields[header];
    }
  }

  range.setValues([row]);
}


// ========== CRUD: DELETE ==========

function deleteAgentQueueEntryByRow(rowNum) {
  var sheet = getSheetByName_("Agent_Queues");
  sheet.deleteRow(rowNum);
}


/*** TEST ONLY START ***/

// function testAddAgentQueue() {
//   var testEntry = {
//     "Agent ID": "Livia",
//     "Agent Name": "Livia",
//     "Agent Role": "Operator",
//     "Task ID": "TASK-TEST-001",
//     "Task Description": "Test adding new task to Agent_Queues",
//     "Status": "Queued",
//     "Priority": "Medium",
//     "Last Updated": new Date(),
//     "Notes": "Test entry"
//   };
//   addAgentQueue(testEntry);
// }

// function testListAgentQueues() {
//   var result = listAgentQueueEntries();
//   Logger.log(result);
// }

// function testGetAgentQueueEntry() {
//   var row = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Agent_Queues").getLastRow();
//   var result = getAgentQueueEntryByRow(row);
//   Logger.log(result);
// }

// function testUpdateAgentQueueEntry() {
//   var row = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Agent_Queues").getLastRow();
//   updateAgentQueueEntryByRow(row, {
//     "Status": "In Progress",
//     "Notes": "Updated by test script"
//   });
// }

// function testDeleteAgentQueueEntry() {
//   var row = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Agent_Queues").getLastRow();
//   deleteAgentQueueEntryByRow(row);
// }

/*** TEST ONLY END ***/
