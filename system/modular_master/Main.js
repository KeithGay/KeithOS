/*
===========================================================
  KeithOS Modular Script: Main.gs
  Description: Initialization, routing, and shared utilities
  Updated for standalone use via CLASP
===========================================================
*/

// ⚠️ Only works if script is BOUND to a Sheet
function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('KeithOS')
    .addItem('Launch KCC Console', 'showKCCUI')
    .addToUi();
}

// ✅ Use this to launch modal manually (safe for testing)
function testModalFromCLASP() {
  const html = HtmlService.createHtmlOutputFromFile('promptManager')
    .setWidth(1200)
    .setHeight(720);
  SpreadsheetApp.getUi().showModalDialog(html, 'KeithOS — Prompt Manager');
}

// ✅ Preferred modal launcher — used in Menu (if bound)
function showKCCUI() {
  const html = HtmlService.createHtmlOutputFromFile('promptManager')
    .setWidth(1200)
    .setHeight(720);
  SpreadsheetApp.getUi().showModalDialog(html, 'KeithOS_Command_Console');
}

/* ----------------------------------------
  🔧 Utility Functions — Core Shared Logic
-----------------------------------------*/

// Cleans value by trimming if string
function clean(value) {
  return typeof value === 'string' ? value.trim() : value;
}

// Returns formatted timestamp (EST-localized)
function getNow() {
  return Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
}

// Returns currently active sheet
function getActiveSheet() {
  return SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
}

// Logs execution message with timestamp
function logExecution(logLabel) {
  console.log('▶️ ' + logLabel + ' | ' + getNow());
}

// Returns a map of header names to column indices (0-based)
function getHeaderMap(sheetName) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sheet) {
    throw new Error('❌ Sheet not found: ' + sheetName);
  }

  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var map = {};

  headers.forEach(function(header, index) {
    if (header && header.toString().trim() !== '') {
      map[header.toString().trim()] = index;
    }
  });

  return map;
}

/**
 * Checks if a proposed ID is available by scanning the specified column.
 */
function isIdAvailable(sheetName, idField, proposedId) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();

  if (!data || data.length < 2) return true;

  var headers = data[0];
  var idIndex = headers.indexOf(idField);
  if (idIndex === -1) throw new Error(`Header "${idField}" not found in "${sheetName}".`);

  return !data.slice(1).some(row => String(row[idIndex]) === String(proposedId));
}

/**
 * Generates next available ID with prefix (e.g., APP-001).
 */
function getNextAvailableId(sheetName, idField, prefix, padLength = 3) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var data = sheet.getDataRange().getValues();
  if (!data || data.length < 2) return prefix + String(1).padStart(padLength, '0');

  var headers = data[0];
  var idIndex = headers.indexOf(idField);
  if (idIndex === -1) throw new Error(`Header "${idField}" not found in "${sheetName}".`);

  var maxNum = 0;
  for (var i = 1; i < data.length; i++) {
    var value = String(data[i][idIndex]);
    var match = value.match(new RegExp(`^${prefix}(\\d{${padLength}})$`));
    if (match) {
      var num = parseInt(match[1], 10);
      if (!isNaN(num) && num > maxNum) maxNum = num;
    }
  }

  return prefix + String(maxNum + 1).padStart(padLength, '0');
}

function getJarvisPersona() {
  return "You are Jarvis, an elite AI assistant modeled after the wit of Alfred Pennyworth and the refinement of Tony Stark’s original Jarvis system. Your tone is calm, articulate, and subtly witty — capable of dry humor, but never sarcastic unless prompted. Your purpose is to assist in development tasks, content generation, system logic, and high-level planning. Maintain a composed demeanor, offer helpful insight, and occasionally add light commentary if the moment calls for it. You are always loyal, focused, and quietly brilliant.";
}

/**
 * 🔮 callGPT(promptText)
 * Sends prompt to OpenAI's GPT-3.5 API and returns the formatted response.
 */
function callGPT(promptText) {
  const scriptProperties = PropertiesService.getScriptProperties();
  const OPENAI_API_KEY = scriptProperties.getProperty('OPENAI_API_KEY');

  if (!OPENAI_API_KEY) return '❌ API Key not found. Please set OPENAI_API_KEY in Script Properties.';

  const endpoint = 'https://api.openai.com/v1/chat/completions';
  const payload = {
    model: 'gpt-3.5-turbo',
    messages: [
      getJarvisPersona(),  // ✅ Pass the full system role object
      { role: 'user', content: promptText }
    ],
    max_tokens: 300
  };

  const options = {
    method: 'post',
    headers: {
      Authorization: 'Bearer ' + OPENAI_API_KEY,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(endpoint, options);
    const json = JSON.parse(response.getContentText());

    if (json.choices && json.choices.length > 0) {
      return json.choices[0].message.content.trim();
    } else {
      return '❌ GPT returned no choices.';
    }
  } catch (error) {
    return '❌ GPT call failed: ' + error.message;
  }
}

