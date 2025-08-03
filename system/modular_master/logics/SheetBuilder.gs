/**
 * 🛠️ SheetBuilder.gs
 * KeithOS Modular Sheet Constructor
 * Author: Designs by Keith Allen LLC
 * Description: Creates the KeithOS_Modular_MasterSheet and injects schema
 */

function createKeithOSMasterSheet() {
  const sheetName = 'KeithOS_Modular_MasterSheet';
  const files = DriveApp.getFilesByName(sheetName);

  let spreadsheet;
  if (files.hasNext()) {
    const file = files.next();
    spreadsheet = SpreadsheetApp.open(file); // ✅ Use open(file) directly
    console.info(`📄 Sheet "${sheetName}" already exists.`);
  } else {
    spreadsheet = SpreadsheetApp.create(sheetName);
    console.info(`🆕 Created sheet: ${sheetName}`);
  }

  const tabs = [
    'Active_Tickets',
    'Archived_Tickets',
    'ColumnSchema_Definitions',
    'Sync_Logs',
    'Checkpoint_Records',
    'Temp_Staging'
  ];

  tabs.forEach(tab => {
    if (!spreadsheet.getSheetByName(tab)) {
      spreadsheet.insertSheet(tab);
      console.info(`➕ Created tab: ${tab}`);
    }
  });

  const defaultSheet = spreadsheet.getSheetByName('Sheet1');
  if (defaultSheet) {
    spreadsheet.deleteSheet(defaultSheet);
    console.info('🗑️ Removed default Sheet1 tab');
  }

  injectColumnSchemas(spreadsheet); // ✅ Safe now
  console.info(`🎉 Sheet setup complete for: ${sheetName}`);
}

function injectColumnSchemas(spreadsheet) {
  const schemaSheet = spreadsheet.getSheetByName('ColumnSchema_Definitions');
  if (!schemaSheet) throw new Error('❌ Missing schema tab');

  const schemaMap = {
    Active_Tickets: [
      'system_activetickets_v1',
      'Timestamp', 'SystemName', 'TicketType', 'Status', 'Priority',
      'AssignedAgent', 'TriggerSource', 'LastUpdated', 'LinkedSheet',
      'EntryId', 'Notes'
    ],
    Archived_Tickets: [
      'system_archivedtickets_v1',
      'Timestamp', 'SystemName', 'TicketType', 'Status', 'Resolution',
      'ArchivedBy', 'ArchiveDate', 'LinkedSheet', 'EntryId', 'Notes'
    ],
    ColumnSchema_Definitions: [
      'system_columndefs_v1',
      'TabName', 'ColumnName', 'ColumnIndex', 'FieldType',
      'IsRequired', 'DefaultValue', 'ValidationRules', 'Notes'
    ],
    Sync_Logs: [
      'system_synclogs_v1',
      'Timestamp', 'SystemName', 'SyncType', 'Status', 'ErrorMessage',
      'AttemptNumber', 'HandledBy'
    ],
    Checkpoint_Records: [
      'system_checkpoints_v1',
      'CheckpointId', 'SystemName', 'CheckpointType',
      'CompletedBy', 'CompletedOn', 'Notes'
    ],
    Temp_Staging: [
      'system_tempstaging_v1',
      'TempId', 'ContentType', 'Payload', 'CreatedOn', 'Notes'
    ]
  };

  const allRows = [];

  Object.entries(schemaMap).forEach(([tab, columns]) => {
    columns.forEach((col, index) => {
      allRows.push([
        tab,
        col,
        index,
        index === 0 ? 'schema_key' : 'string',
        index === 0 ? 'yes' : '',
        '',
        '',
        ''
      ]);
    });
  });

  schemaSheet.clear();
  schemaSheet.getRange(1, 1, allRows.length, 8).setValues(allRows);
  console.info('📌 Schema injected into ColumnSchema_Definitions');
}
