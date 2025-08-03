///////////////////////////////
// PluginHosting.gs
// Google Apps Script Web App for KeithOS Plugin
///////////////////////////////

/*
📌 FIELD GUIDE — KeithOS Command Router API
-------------------------------------------
Expected Input Payload:
{
  "commandLabel": "addProtocolEntry",
  "data": {
    "Rule ID": "SSP-XXXX-XX",
    "Prompt Type": "System Protocol",
    "Usage Scenario": "...",
    "Instruction": "...",
    "Example": "...",
    "Notes": "..."
  }
}

Returns:
{
  "status": "success",
  "result": "✅ Protocol logged: SSP-XXXX-XX"
}
*/

// ✅ GLOBAL CATCH for testable endpoints and plugin manifest access
function doGet(e) {
  try {
    var path = (e.parameter && e.parameter.path) ? e.parameter.path : "";

    // ✅ Simple Web App Test
    if (path === "test") {
      return ContentService.createTextOutput("Web app is working!")
        .setMimeType(ContentService.MimeType.TEXT);
    }

    // 📄 Serve AI Plugin Manifest (schema.json)
    if (path === ".well-known/ai-plugin.json") {
      var manifest = {
        schema_version: "v1",
        name_for_human: "KeithOS Command Plugin",
        name_for_model: "keithos_command_plugin",
        description_for_human: "Trigger internal commands inside KeithOS.",
        description_for_model: "Use this tool to execute commands like logging protocols, updating agents, or writing entries.",
        auth: { type: "none" },
        api: {
          type: "openapi",
          url: getBaseUrl() + "?path=openapi.yaml"
        },
        logo_url: "https://yourdomain.com/logo.png",
        contact_email: "you@example.com",
        legal_info_url: "https://yourdomain.com/legal"
      };

      return ContentService.createTextOutput(JSON.stringify(manifest))
        .setMimeType(ContentService.MimeType.JSON);
    }

    // 📘 Serve OpenAPI Spec (openapi.yaml)
    if (path === "openapi.yaml") {
      var yaml = [
        "openapi: 3.1.0",
        "info:",
        "  title: KeithOS Command Plugin",
        "  description: Trigger internal commands inside KeithOS.",
        '  version: "1.0.0"',
        "servers:",
        `  - url: ${getBaseUrl()}`,
        "paths:",
        "  /:",
        "    post:",
        "      summary: Execute a KeithOS command",
        "      operationId: executeCommand",
        "      requestBody:",
        "        required: true",
        "        content:",
        "          application/json:",
        "            schema:",
        "              type: object",
        "              properties:",
        "                commandLabel:",
        "                  type: string",
        "                  description: Command type (e.g., 'addProtocolEntry')",
        "                data:",
        "                  type: object",
        "                  description: Associated payload",
        "      responses:",
        '        "200":',
        "          description: Success",
        "          content:",
        "            application/json:",
        "              schema:",
        "                type: object",
        "                properties:",
        "                  status:",
        "                    type: string",
        "                  result:",
        "                    type: string"
      ].join("\n");

      return ContentService.createTextOutput(yaml)
        .setMimeType(ContentService.MimeType.YAML);
    }

    // 🛑 Fallback
    return ContentService.createTextOutput("Not found")
      .setMimeType(ContentService.MimeType.TEXT);

  } catch (err) {
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}


// ===========================
// 🔁 Relay Entry Point
// ===========================
function doPost(e) {
  try {
    if (!e || !e.postData || !e.postData.contents) {
      throw new Error("Missing or invalid postData");
    }

    var payload = JSON.parse(e.postData.contents);
    var commandLabel = payload.commandLabel;
    var data = payload.data || {};

    var result = handleCommand(commandLabel, data);

    return ContentService.createTextOutput(
      JSON.stringify({ status: "success", result: result })
    ).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log("❌ Error in doPost: " + err.message);
    return ContentService.createTextOutput(
      JSON.stringify({ status: "error", message: err.message })
    ).setMimeType(ContentService.MimeType.JSON);
  }
}


// ===========================
// 🧠 Command Dispatcher
// ===========================
function handleCommand(label, data) {
  switch (label) {
    case "addProtocolEntry":
      return addProtocolEntry(data); // Option 2: relay to same file or rewire later
    case "updateAgentStatus":
      return "✅ Agent status logic not yet connected.";
    case "logSaveState":
      return "✅ SaveState logic not yet connected.";
    default:
      throw new Error("Unknown command: " + label);
  }
}


// ===========================
// ✍️ Temporary Test Function
// Will be removed once real Playbook.gs relay is wired
// ===========================
function addProtocolEntry(data) {
  var sheet = SpreadsheetApp.openById("1y3LLySy4BrTQjIdAg9unnUny2399ruY0WsIckcn6AoI")
    .getSheetByName("KeithOS_Playbook");
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var map = {};
  headers.forEach((h, i) => { if (h) map[h.trim()] = i; });

  var row = new Array(headers.length).fill("");
  if (map["Timestamp"] !== undefined) row[map["Timestamp"]] = new Date();
  for (var key in data) {
    if (map[key] !== undefined) row[map[key]] = data[key];
  }
  if (map["Source"] !== undefined) row[map["Source"]] = "Plugin Relay";

  sheet.appendRow(row);
  return "✅ Protocol logged: " + (data["Rule ID"] || "(no Rule ID)");
}


// ===========================
// 📡 Helper for Manifest URL
// ===========================
function getBaseUrl() {
  return ScriptApp.getService().getUrl();
}
