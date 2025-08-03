////////////////////////////////////////////////////
// 📡 Jarvis.updateRelayURL
// CRUD Command: Update (Properties)
// Purpose: Stores the current active relay URL + label
////////////////////////////////////////////////////

/*
📘 FIELD GUIDE — Jarvis.updateRelayURL
---------------------------------------
Stores the current Apps Script relay endpoint in script properties.
Used by sendCommandToPlugin() to POST real commands to your backend.

🛠️ Parameters:
- newURL (string): The full relay Web App URL
- deploymentId (string): A label to identify the source (e.g., "apps-script-relay-v1")

📤 Writes To:
- Script Properties
  • PLUGIN_RELAY_URL
  • PLUGIN_DEPLOYMENT_ID
*/

function updateRelayURL(newURL, deploymentId) {
  PropertiesService.getScriptProperties().setProperty("PLUGIN_RELAY_URL", newURL);
  PropertiesService.getScriptProperties().setProperty("PLUGIN_DEPLOYMENT_ID", deploymentId);
  return `✅ Relay updated: ${newURL} (ID: ${deploymentId})`;
}

////////////////////////////////////////////////////
// 📥 Jarvis.getRelayURL
// Purpose: Retrieve the current relay endpoint
////////////////////////////////////////////////////

function getRelayURL() {
  return PropertiesService.getScriptProperties().getProperty("PLUGIN_RELAY_URL") || "❌ Relay URL not set";
}

////////////////////////////////////////////////////
// 📥 Jarvis.getRelayDeploymentID
// Purpose: Retrieve the current relay label
////////////////////////////////////////////////////

function getRelayDeploymentID() {
  return PropertiesService.getScriptProperties().getProperty("PLUGIN_DEPLOYMENT_ID") || "❌ Deployment ID not set";
}

////////////////////////////////////////////////////
// 🚀 Jarvis.sendCommandToPlugin
// Purpose: Sends command + payload to the current relay endpoint
////////////////////////////////////////////////////

/*
📘 FIELD GUIDE — Jarvis.sendCommandToPlugin
--------------------------------------------
Core dispatch function that sends structured GPT commands to the relay.

🛠️ Parameters:
- commandLabel (string): The target function name (e.g., "addProtocolEntry")
- data (object): Payload to send to the server

📤 Sends POST request to:
- URL returned by getRelayURL()

✅ Example:
Jarvis.sendCommandToPlugin("addProtocolEntry", {
  "Rule ID": "SSP-JARVIS-LIVE-TEST",
  ...
});
*/

function sendCommandToPlugin(commandLabel, data) {
  const url = getRelayURL();
  if (url === "❌ Relay URL not set") {
    throw new Error("Relay URL not configured. Run updateRelayURL() first.");
  }

  const payload = {
    commandLabel,
    data
  };

  const options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());

  Logger.log(`📡 Command Sent: ${commandLabel}`);
  Logger.log(`🔁 Plugin Response: ${JSON.stringify(result)}`);
  return result;
}

////////////////////////////////////////////////////
// ✅ SETUP FUNCTION — Switches to Apps Script Relay
////////////////////////////////////////////////////

function updateRelayToAppsScriptWebApp() {
  const result = updateRelayURL(
    "https://script.google.com/macros/s/AKfycbwOGWIjDN-Aoqq7LjxPsVHQnnjqkLbysmKuqsuOzLEgHbSfIcLhBK7SzcsruNbePhP4UA/exec",
    "apps-script-relay-v1"
  );
  Logger.log(result);
}

////////////////////////////////////////////////////
// ✅ TEST FUNCTION — Confirm live dispatch
////////////////////////////////////////////////////

function testSendCommand_Live() {
  const result = sendCommandToPlugin("addProtocolEntry", {
    "Rule ID": "SSP-JARVIS-LIVE-TEST",
    "Prompt Type": "System Protocol",
    "Usage Scenario": "Live plugin logic test",
    "Instruction": "Use Apps Script relay and skip simulation.",
    "Example": "Jarvis logs this entry to KeithOS_Playbook",
    "Notes": "Live payload to confirmed working Web App relay"
  });
  Logger.log(result);
}
