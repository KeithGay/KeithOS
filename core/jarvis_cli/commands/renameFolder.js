// commands/renameFolder.js
const fs = require('fs');
const path = require('path');


module.exports = function(args, dryRun) {
  const [oldName, newName] = args.filter(arg => !arg.startsWith('--'));
  const oldPath = path.join(__dirname, '..', 'sandbox', oldName);
  const newPath = path.join(__dirname, '..', 'sandbox', newName);

  if (!oldName || !newName) {
    return console.log('❗ Please provide both the current and new folder names.');
  }

  if (!fs.existsSync(oldPath)) {
    return console.log(`❌ Folder not found: ${oldPath}`);
  }

  if (fs.existsSync(newPath)) {
    return console.log(`⚠️ Target folder already exists: ${newPath}`);
  }

  if (dryRun) {
    console.log(`🧪 [DRY RUN] Would have renamed: ${oldPath} → ${newPath}`);
  } else {
    fs.renameSync(oldPath, newPath);
    console.log(`✅ Folder renamed to: ${newPath}`);
  }
};
