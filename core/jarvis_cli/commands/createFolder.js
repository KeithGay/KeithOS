// commands/createFolder.js

const fs = require('fs');
const path = require('path');

/**
 * Main folder generation logic with optional preset support and dry run mode.
 *
 * Usage:
 * node createFolder.js "C:\\your\\path\\MBBA_LogoRebrand" --preset mbba-logo --dry
 *
 * @param {Array<string>} args - Command-line args (path + flags)
 * @param {boolean} dryRun - Whether to simulate actions without writing
 */
function createFolder(args, dryRun) {
  // Extract the first non-flag argument as the target path
  const basePath = args.find(arg => !arg.startsWith('--'));
  if (!basePath) {
    console.log('❗ No target path provided.');
    return;
  }

  // Get the preset value if provided
  const presetIndex = args.indexOf('--preset');
  const presetName = presetIndex !== -1 && args[presetIndex + 1] ? args[presetIndex + 1] : null;

  // Define known presets
  const presets = {
  'mbba-logo': [
    '01_Logo_Design_AD2/',
    '01_Logo_Design_AD2/Sketches_Concepts/',
    '01_Logo_Design_AD2/Final_Logo_SVG/',
    '01_Logo_Design_AD2/Final_Logo_PNG/',
    '01_Logo_Design_AD2/AD2_Templates/',
    '02_Canva_Asset_Prep/',
    '02_Canva_Asset_Prep/Logos_For_Canva/',
    '02_Canva_Asset_Prep/Brand_Colors_Reference/',
    '02_Canva_Asset_Prep/Font_Info/',
    '02_Canva_Asset_Prep/Canva_Upload_Log/',
    '03_Client_Delivery/',
    '03_Client_Delivery/Brand_Guide_PDF/',
    '03_Client_Delivery/Usage_Notes/'
  ],
  'branding-kit-template': [
    'Working Files/',
    'Working Files/Docs/',
    'Working Files/Moodboard + References/',
    'Working Files/AD2 Files/',
    'Working Files/Drafts/',
    'Final Delivery/',
    'Final Delivery/Brand Colors/',
    'Final Delivery/Fonts/',
    'Final Delivery/Logo Master Files/',
    'Final Delivery/PDFs/',
    'Final Delivery/PNGs/',
    'Final Delivery/SVGs/',
    'Final Delivery/Social Templates/'
  ]
  };

  // If a valid preset is found, build full tree
  if (presetName && presets[presetName]) {
    console.log(`📁 Using preset: ${presetName}`);
    presets[presetName].forEach((relativePath) => {
      const fullPath = path.join(basePath, relativePath);
      if (dryRun) {
        console.log(`🧪 [DRY RUN] Would create: ${fullPath}`);
      } else {
        try {
          if (!fs.existsSync(fullPath)) {
            fs.mkdirSync(fullPath, { recursive: true });
            console.log(`✅ Created: ${fullPath}`);
          } else {
            console.log(`⚠️ Skipped (already exists): ${fullPath}`);
          }
        } catch (err) {
          console.error(`❌ Error creating ${fullPath}:`, err.message);
        }
      }
    });
  } else if (presetName) {
    // Invalid preset provided
    console.log(`❌ Unknown preset: ${presetName}`);
  } else {
    // No preset — create only the base path
    if (dryRun) {
      console.log(`🧪 [DRY RUN] Would have created: ${basePath}`);
    } else {
      try {
        if (!fs.existsSync(basePath)) {
          fs.mkdirSync(basePath, { recursive: true });
          console.log(`✅ Folder created at: ${basePath}`);
        } else {
          console.log(`⚠️ Folder already exists: ${basePath}`);
        }
      } catch (err) {
        console.error(`❌ Error creating base folder: ${err.message}`);
      }
    }
  }
}

// 🔁 If file is executed directly (not imported), auto-run
if (require.main === module) {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry');
  createFolder(args, dryRun);
}

module.exports = createFolder;
