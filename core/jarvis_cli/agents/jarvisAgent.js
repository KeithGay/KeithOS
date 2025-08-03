#!/usr/bin/env node

// agents/jarvisAgent.js

require('dotenv').config();
const path = require('path');
const { execSync } = require('child_process');

// 🔖 Folder structure presets
const folderPresets = {
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
  ]
};

// Extract CLI args
const [,, command, ...args] = process.argv;
const isDryRun = args.includes('--dry');

// 🆘 Help Menu Output
if (command === 'help' || command === '--help') {
  const presetDescriptions = Object.entries(folderPresets)
    .map(([name, structure]) => {
      const formatted = structure.map(f => `    • ${f}`).join('\n');
      return `  🧩 ${name}:\n${formatted}`;
    })
    .join('\n\n');

  console.log(`
🎮 Jarvis CLI – Command Help + Launch Codes
────────────────────────────────────────────

📦 FOLDER BUILDER MODULES
────────────────────────────
📁 Quick Folder:
   ▶️ jarvis create-folder "C:\\path\\to\\MyProject"
   🧪 Test it first:      --dry

🧩 Preset Folder Build:
   ▶️ jarvis create-folder "C:\\path\\to\\MBBA_LogoRebrand" --preset mbba-logo
   🧪 Test the preset:    --preset mbba-logo --dry

✏️ Rename Folder:
   ▶️ jarvis rename-folder OldName NewName
   🧪 Test the rename:    --dry

📚 Available Presets:
${presetDescriptions}

🧠 GPT THINK MODULES
────────────────────────────
🎤 One-liner Prompt:
   ▶️ jarvis "Summarize this idea in 3 lines"
   ▶️ jarvis "List 5 product names for a candle brand"

🎛 Custom Output Control:
   --model [4|3.5]        (default: gpt-4)
   --temp [0–1]           (creativity: 0.2 = focused, 0.9 = random)
   --slow                 (one-character-at-a-time printout)

📁 GIT COMMAND REFERENCE
────────────────────────────
📦 Stage All Changes:
   ▶️ git add .

✅ Commit Changes:
   ▶️ git commit -m "Update: Describe your change here"

🚀 Push to GitHub:
   ▶️ git push origin main

🔄 Pull Latest from GitHub:
   ▶️ git pull origin main

📂 View Repo Status:
   ▶️ git status

🧲 Jarvis Push Shortcut:
   ▶️ jarvis push
   ▶️ jarvis push "Update: Added voice CPC"

⚙️ GLOBAL FLAGS
────────────────────────────
--dry                    Preview folder actions only
--preset [name]          Use saved folder layout
help, --help             Show this menu

💡 Pro Tip:
Use full file paths when building folders outside the project root.
`);
  process.exit(0);
}

// 🧭 Command Router
function routeCommand(cmd, args) {
  switch (cmd) {
    case 'create-folder': {
      const createFolder = require('../commands/createFolder');
      createFolder(args, isDryRun);
      break;
    }
    case 'rename-folder': {
      const renameFolder = require('../commands/renameFolder');
      renameFolder(args, isDryRun);
      break;
    }
    case 'push': {
      const commitMsg = args.join(' ') || `Jarvis Auto Commit – ${new Date().toLocaleString()}`;
      try {
        console.log(`📦 Staging all changes...`);
        execSync(`git add .`, { stdio: 'inherit' });

        console.log(`✅ Checking for changes...`);
        const status = execSync(`git status --porcelain`).toString().trim();

        if (!status) {
          console.log(`⚠️ Nothing to commit. Working tree clean.`);
          break;
        }

        console.log(`✅ Committing changes...`);
        execSync(`git commit -m "${commitMsg}"`, { stdio: 'inherit' });

        console.log(`🚀 Pushing to main...`);
        execSync(`git push origin main`, { stdio: 'inherit' });

        console.log(`🎉 Push complete!`);
      } catch (err) {
        console.error(`❌ Git push failed:`, err.message);
      }
      break;
    }
    case 'run-prompt': {
      const runPrompt = require('../prompts/runPrompt');
      const input = args.join(' ');
      const model = args.includes('--model') ? (
        args[args.indexOf('--model') + 1] === '3.5' ? 'gpt-3.5-turbo' : 'gpt-4'
      ) : 'gpt-4';
      const temp = args.includes('--temp') ? parseFloat(args[args.indexOf('--temp') + 1]) : 0.7;
      const isSlow = args.includes('--slow');

      if (!input) {
        console.log('❗ Please enter a prompt, like: jarvis run-prompt "Give me 5 ideas for a newsletter."');
        break;
      }

      runPrompt(input, model, temp, isSlow);
      break;
    }
    default: {
      const runPrompt = require('../prompts/runPrompt');
      const allArgs = [cmd, ...args];

      const model = allArgs.includes('--model')
        ? (allArgs[allArgs.indexOf('--model') + 1] === '3.5' ? 'gpt-3.5-turbo' : 'gpt-4')
        : 'gpt-4';

      const temp = allArgs.includes('--temp')
        ? parseFloat(allArgs[allArgs.indexOf('--temp') + 1])
        : 0.7;

      const isSlow = allArgs.includes('--slow');

      const prompt = allArgs.filter((arg, idx) => {
        const skipNext = ['--model', '--temp'].includes(allArgs[idx - 1]);
        return !['--model', '--temp', '--slow', '3.5', '4'].includes(arg) && !skipNext;
      }).join(' ');

      if (!prompt) {
        console.log('❗ You need to enter a GPT prompt.');
        break;
      }

      runPrompt(prompt, model, temp, isSlow);
      break;
    }
  }
}

// 🚀 Launch CLI
console.log(`🤖 Jarvis Agent CLI initialized...`);
routeCommand(command, args);
