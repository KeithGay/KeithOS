/////////////////////////////////////////////////////
// NLC_Router.gs
// Command Routing for: NLC → CommandRouter
/////////////////////////////////////////////////////

/*
📌 FIELD GUIDE — NLC Router
---------------------------------------
Purpose:
  Translate simplified natural commands (e.g., “add protocol”) into internal system commands using `handleCommand`.

Expected Inputs:
  - commandLabel (e.g., "addProtocolEntry")

Expected Behaviors:
  - Retrieve a static payload for known labels (Phase 1 only)
  - Route to handleCommand(commandLabel, payload)

Dependencies:
  - handleCommand() from CommandRouter.gs
  - addSaveState() from shared script
*/

/**
 * Routes a simplified command label to the proper handler with payload.
 *
 * @param {string} commandLabel - The command to route (e.g., "addProtocolEntry")
 * @param {Object} [data] - Optional payload to pass
 * @returns {*} The result of the handleCommand call
 */
function routeNaturalCommand(commandLabel, data) 
{
  var samplePayloads = {
    // Optional static fallback payloads can be added here
    // Example:
    // "addProtocolEntry": {
    //   "Rule ID": "SSP-EXAMPLE-001",
    //   "Prompt Type": "System Protocol",
    //   "Usage Scenario": "Placeholder for fallback routing",
    //   "Instruction": "This is a sample static entry.",
    //   "Example": "addProtocolEntry with default",
    //   "Notes": "Used only if dynamic data not provided"
    // }
  };

  if (data && Object.keys(data).length > 0) {
    return handleCommand(commandLabel, data);
  }

  if (!samplePayloads[commandLabel]) {
    throw new Error('No payload available for command: ' + commandLabel);
  }

  return handleCommand(commandLabel, samplePayloads[commandLabel]);
}

/*** TEST ONLY START ***/
// 🧪 TEST CASES — NLC_Router.gs

function testRouteAddProtocolEntry() {
  var result = routeNaturalCommand("addProtocolEntry");
  Logger.log(result);
}

function testRouteLogSaveState() {
  var result = routeNaturalCommand("logSaveState");
  Logger.log(result);
}

/*** TEST ONLY END ***/
