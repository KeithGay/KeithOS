///////////////////////////////
// CustomCommandRepo.gs
// Command Shortcut Execution for: Custom_CommandRepo sheet
///////////////////////////////

/*
FIELD GUIDE — CustomCommandRepo
---------------------------------------
Sheet Name: "Custom_CommandRepo"

Expected Headers:
- Command Alias
- Mapped Command Label
- Preset Payload JSON
- Editable
- Notes / Conditions

Purpose:
Allows fast execution of predefined system commands using simple aliases.
Used for repeating common protocol logs, task pushes, etc.

Sample Command:
  runCustomCommand("Save SSP Tone")

Dependencies:
- handleCommand(commandLabel, payload) from CommandRouter.gs
*/

function runCustomCommand(commandAlias) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Custom_Command_Repo");
  if (!sheet) throw new Error("Custom_Command_Repo sheet not found.");

  var data = sheet.getDataRange().getValues();
  var headers = data[0];

  var aliasIndex = headers.indexOf("Command Alias");
  var labelIndex = headers.indexOf("Mapped Command Label");
  var payloadIndex = headers.indexOf("Preset Payload JSON");

  for (var i = 1; i < data.length; i++) {
    if (data[i][aliasIndex] === commandAlias) {
      var commandLabel = data[i][labelIndex];
      var rawJson = data[i][payloadIndex];

      try {
        var payload = JSON.parse(rawJson);
        return handleCommand(commandLabel, payload);
      } catch (err) {
        throw new Error('Invalid JSON in payload for "' + commandAlias + '":\n' + err.message);
      }
    }
  }

  throw new Error('Command alias "' + commandAlias + '" not found in Custom_Command_Repo.');
}

/*** TEST ONLY START ***/
// TEST CASES — CustomCommandRepo.gs

function testRunCustomCommand_SaveTone() {
  var result = runCustomCommand("Save SSP Tone");
  Logger.log(result);
}
/*** TEST ONLY END ***/
