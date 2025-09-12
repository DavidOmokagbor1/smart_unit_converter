# 🚨 QUICK REFERENCE - CONFLICT PREVENTION RULES

## 🔴 **NEVER MODIFY THESE FILES**
```
❌ docs/index.html                 # Main deployed app
❌ docs/draggable_categories.js    # Working drag feature
❌ docs/service-worker.js          # Working offline support
❌ smart_unit_converter/main.py    # Core conversion logic
❌ smart_unit_converter/cli_converter.py # Working CLI
❌ smart_unit_converter/test_converter.py # Working tests
❌ deploy.sh                       # Working deployment script
❌ netlify.toml, vercel.json       # Deployment configs
❌ README.md                       # Project documentation
```

## ✅ **SAFE TO MODIFY**
```
✅ All .md files (documentation)
✅ New files in smart_unit_converter/
✅ New HTML/CSS/JS files
✅ Configuration files (if needed)
```

## 🛡️ **BEFORE ANY CHANGE**
1. **Create backup**: `cp -r smart_unit_converter smart_unit_converter_backup_$(date +%Y%m%d)`
2. **Check git status**: `git status`
3. **Create branch**: `git checkout -b feature/your-feature-name`
4. **Work ONLY in smart_unit_converter/ folder**

## 🚨 **EMERGENCY RESTORE**
```bash
# If you break something:
git checkout HEAD -- filename
# OR
cp smart_unit_converter_backup_YYYYMMDD/filename smart_unit_converter/
```

## 📋 **WORKFLOW**
1. **Edit** → smart_unit_converter/ folder
2. **Test** → `python3 smart_unit_converter/test_converter.py`
3. **Deploy** → Copy new files to docs/
4. **Verify** → Open docs/index.html

## 🎯 **GOLDEN RULE**
**If it works, don't touch it. Create new files for new features.**
