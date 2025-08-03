# KeithOS

KeithOS is a modular automation system designed to streamline workflows, manage agents, and unify business operations through structured logic and intelligent sheets.

This repository is the **main workspace** for KeithOS development. It includes all core files, automation scripts, modular sheet builders, and logic components used across the system.

---

## 📁 Key Folders

| Folder                  | Purpose |
|-------------------------|---------|
| `system/modular_master` | Houses the `KeithOS_Modular_MasterSheet` and setup logic |
| `system/core_logic`     | (Pending) Core operator logic for Livia, Jarvis, etc. |
| `system/utils`          | (Planned) Shared utilities, constants, error handling |
| `ui`                    | HTML/CSS/JS for modal interface (injection ready) |
| `logics`                | Folder where modular logic files like `SheetBuilder.gs` live |

---

## 🧪 First Setup: Modular Master Sheet

This repo comes with a first-use Apps Script (`SheetBuilder.gs`) to initialize the master sheet.

### 🔨 To run:

1. Connect with `clasp`:
   ```bash
   clasp clone [scriptId]
