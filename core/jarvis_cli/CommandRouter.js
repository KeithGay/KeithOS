// ══════════════════════════════════════════════════════════════════════
// 📘 FIELD GUIDE: CommandRouter.gs
// ──────────────────────────────────────────────────────────────────────
// 🎯 Purpose:
// Centralized dispatcher for routing Jarvis commands to the correct handlers.
//
// 📥 Input Parameters:
// - commandName (string): Name of the command to execute
// - payload (object): Data object passed to the handler
//
// 📤 Returns:
// - Output from the target function or an error if the command is invalid
//
// 🧩 Connected Handlers:
// - Playbook.gs (addPlaybookRule, logPlaybookEntry)
// - SaveStates.gs (logSaveState)
// - Agents.gs (updateAgentStatus)
// - Tasks.gs (pushToTesting, archiveTask, generateMilestone)
//
// 🔁 Common Entry Point from Jarvis:
// handleCommand("addProtocolEntry", payloadObject)
// ══════════════════════════════════════════════════════════════════════

function handleCommand(commandName, payload) {
  switch (commandName) {

    // ─── KeithOS Playbook Protocol Commands ─────────────────────────────
    case "addProtocolEntry":
      return addPlaybookRule(payload); // 🚀 Core Playbook write function

    case "logPlaybookEntry":
      return logPlaybookEntry(payload); // 🗃️ Optional alias or legacy route

    // ─── Save State Logging ─────────────────────────────────────────────
    case "logSaveState":
      return logSaveState(payload);

    // ─── Agent Status Management ────────────────────────────────────────
    case "updateAgentStatus":
      return updateAgentStatus(payload);

    // ─── Project Management Utilities ───────────────────────────────────
    case "pushToTesting":
      return pushToTesting(payload);

    case "archiveTask":
      return archiveTask(payload);

    case "generateMilestone":
      return generateMilestone(payload);

    // ─── Fallback for Unknown Commands ──────────────────────────────────
    default:
      throw new Error("🛑 Unrecognized command: " + commandName);
  }
}

// ══════════════════════════════════════════════════════════════════════
// 🧪 TEST FOOTER
// ──────────────────────────────────────────────────────────────────────
// Run this function manually in the Apps Script IDE to test command routing
// Expected: SSP-COMMANDROUTER-01 should be logged in KeithOS_Playbook
// ══════════════════════════════════════════════════════════════════════

function testHandleCommand() {
  const testPayload = {
    "Rule ID": "SSP-COMMANDROUTER-01",
    "Prompt Type": "System Protocol",
    "Usage Scenario": "Command Router Test",
    "Instruction": "Validate payload routing from CommandRouter to Playbook.gs",
    "Example": "Jarvis → logPlaybookEntry(payload)",
    "Notes": "Test completed on 6/15/2025"
  };

  const result = handleCommand("addProtocolEntry", testPayload);
  Logger.log("✅ Command Result:", result);
}
