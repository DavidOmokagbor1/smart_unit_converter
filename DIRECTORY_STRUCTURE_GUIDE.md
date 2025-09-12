# 📁 DIRECTORY STRUCTURE GUIDE

## 🎯 **VISUAL PROJECT LAYOUT**

```
smart_unit_converter-main/
│
├── 📁 docs/                           # 🚀 LIVE DEPLOYMENT (DO NOT EDIT)
│   ├── 🔒 index.html                  # Main application - PROTECTED
│   ├── 🔒 draggable_categories.js     # Drag feature - PROTECTED  
│   ├── 🔒 service-worker.js           # Offline support - PROTECTED
│   ├── 🔒 user_friendly_preferences.js # Preferences - PROTECTED
│   └── 🔒 .nojekyll                   # GitHub Pages config - PROTECTED
│
├── 📁 smart_unit_converter/           # 🛠️ SOURCE CODE (SAFE TO EDIT)
│   ├── 🔒 main.py                     # Core logic - PROTECTED
│   ├── 🔒 cli_converter.py            # CLI interface - PROTECTED
│   ├── 🔒 test_converter.py           # Test suite - PROTECTED
│   ├── 🔒 requirements.txt            # Dependencies - PROTECTED
│   ├── ✅ stunning_converter.html     # Source HTML - SAFE TO EDIT
│   ├── ✅ web_converter.html          # Basic HTML - SAFE TO EDIT
│   ├── ✅ draggable_categories.js     # Source JS - SAFE TO EDIT
│   ├── ✅ service-worker.js           # Source SW - SAFE TO EDIT
│   └── ✅ user_friendly_preferences.js # Source prefs - SAFE TO EDIT
│
├── 🔒 deploy.sh                       # Deployment script - PROTECTED
├── 🔒 netlify.toml                    # Netlify config - PROTECTED
├── 🔒 vercel.json                     # Vercel config - PROTECTED
├── 🔒 README.md                       # Main docs - PROTECTED
├── ✅ PROJECT_SUMMARY.md              # Project overview - SAFE TO EDIT
├── ✅ DEVELOPMENT_GUIDE.md            # Dev instructions - SAFE TO EDIT
├── ✅ CONFLICT_PREVENTION_GUIDE.md    # This guide - SAFE TO EDIT
├── ✅ QUICK_REFERENCE_RULES.md        # Quick rules - SAFE TO EDIT
└── ✅ DIRECTORY_STRUCTURE_GUIDE.md    # This file - SAFE TO EDIT
```

---

## 🚨 **LEGEND**

### 🔒 **PROTECTED FILES** (DO NOT EDIT)
- **Working correctly**
- **Deployed and live**
- **Critical functionality**
- **Modifying will break the app**

### ✅ **SAFE TO EDIT**
- **Documentation files**
- **Source files in smart_unit_converter/**
- **New feature files**
- **Configuration improvements**

---

## 📋 **FOLDER RULES**

### **docs/ Folder - DEPLOYMENT ONLY**
```
Purpose: Contains the live, deployed version
Rule: NEVER edit files directly in this folder
Process: Make changes in source, then copy to docs/
Status: 🔒 ALL FILES PROTECTED
```

### **smart_unit_converter/ Folder - SOURCE CODE**
```
Purpose: Contains original source files
Rule: This is where you make changes
Process: Edit here, then deploy to docs/
Status: ✅ SAFE TO EDIT (except protected files)
```

### **Root Level - CONFIGURATION**
```
Purpose: Contains deployment and project configs
Rule: Only edit if absolutely necessary
Process: Test thoroughly before changes
Status: 🔒 MOSTLY PROTECTED
```

---

## 🎯 **DEVELOPMENT WORKFLOW**

### **1. WORKING ON NEW FEATURES**
```
✅ Edit files in: smart_unit_converter/
✅ Test changes: python3 smart_unit_converter/test_converter.py
✅ Deploy to: docs/ (copy new files only)
✅ Verify: Open docs/index.html
```

### **2. WORKING ON DOCUMENTATION**
```
✅ Edit any .md file in root
✅ Update project information
✅ Add new guides or instructions
✅ Commit changes to git
```

### **3. EMERGENCY SITUATIONS**
```
🚨 If you break something:
   1. Stop immediately
   2. Restore from backup
   3. Check git status
   4. Restore to last working state
```

---

## 🛡️ **CONFLICT PREVENTION**

### **RULE 1: SEPARATION OF CONCERNS**
- **Source Code** → `smart_unit_converter/`
- **Deployment** → `docs/`
- **Documentation** → Root level

### **RULE 2: PROTECT WORKING CODE**
- **Never edit protected files**
- **Create new files for new features**
- **Test before deployment**

### **RULE 3: MAINTAIN STRUCTURE**
- **Keep files in designated folders**
- **Follow naming conventions**
- **Preserve directory hierarchy**

---

## 📊 **FILE STATUS SUMMARY**

| Folder | Status | Action | Risk Level |
|--------|--------|--------|------------|
| `docs/` | 🔒 Protected | Copy to only | HIGH |
| `smart_unit_converter/` | ✅ Safe | Edit freely | LOW |
| Root `.md` files | ✅ Safe | Edit freely | LOW |
| Root config files | 🔒 Protected | Edit carefully | HIGH |

---

## 🎉 **QUICK COMMANDS**

### **Create Backup**
```bash
cp -r smart_unit_converter smart_unit_converter_backup_$(date +%Y%m%d)
```

### **Test Application**
```bash
python3 smart_unit_converter/test_converter.py
```

### **Deploy Changes**
```bash
# Copy new files to docs/
cp smart_unit_converter/new_feature.html docs/
```

### **Check Status**
```bash
git status
ls -la docs/
ls -la smart_unit_converter/
```

---

## 🚨 **EMERGENCY RESTORE**

### **Restore Single File**
```bash
git checkout HEAD -- filename
```

### **Restore Entire Folder**
```bash
cp -r smart_unit_converter_backup_YYYYMMDD smart_unit_converter
```

### **Restore to Last Working State**
```bash
git checkout HEAD~1
```

---

## 🎯 **REMEMBER**

**🟢 GREEN LIGHT**: Edit documentation and source files  
**🟡 YELLOW LIGHT**: Be careful with configuration files  
**🔴 RED LIGHT**: Never edit protected deployment files  

**The goal is to enhance without breaking what's already working! 🚀**
