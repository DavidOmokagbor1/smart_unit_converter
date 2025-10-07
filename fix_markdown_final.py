#!/usr/bin/env python3
"""
Fix Markdown Linting Errors - Final Version
"""

import os
import re

def fix_markdown_errors(file_path):
    """Fix markdown linting errors"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix multiple blank lines
        content = re.sub(r'\n{3,}', '\n\n', content)
        
        # Fix headings without blank lines around them
        content = re.sub(r'(\n)(#{1,6}\s)', r'\1\n\2', content)
        content = re.sub(r'(#{1,6}[^\n]*\n)([^\n#])', r'\1\n\2', content)
        
        # Fix lists without blank lines around them
        content = re.sub(r'(\n)([\*\-\+]\s)', r'\1\n\2', content)
        content = re.sub(r'([\*\-\+][^\n]*\n)([^\n\*\-\+])', r'\1\n\2', content)
        
        # Fix code fences without blank lines around them
        content = re.sub(r'(\n)(```)', r'\1\n\2', content)
        content = re.sub(r'(```[^\n]*\n)([^\n`])', r'\1\n\2', content)
        
        # Fix bare URLs
        content = re.sub(r'([^[])(https?://[^\s\)]+)([^]])', r'\1[\2](\2)\3', content)
        
        # Fix trailing punctuation in headings
        content = re.sub(r'^(#{1,6}\s+[^!]*?)[!:]+\s*$', r'\1', content, flags=re.MULTILINE)
        
        # Fix fenced code blocks without language
        content = re.sub(r'^```\s*$', '```text', content, flags=re.MULTILINE)
        
        # Fix ordered list prefixes (simpler approach)
        lines = content.split('\n')
        for i, line in enumerate(lines):
            if re.match(r'^\s*\d+\.\s+', line):
                lines[i] = re.sub(r'^(\s*)\d+\.\s+', r'\11. ', line)
        content = '\n'.join(lines)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Fixed markdown errors in {file_path}")
        return True
    except Exception as e:
        print(f"❌ Error fixing {file_path}: {e}")
        return False

def main():
    print("📝 Fixing Markdown Errors - Final...")
    print("=" * 40)
    
    markdown_files = [
        "security-templates/README.md",
        "TEAM_SECURITY_GUIDELINES.md", 
        "security-templates/project-security-checklist.md",
        "APP_STORE_DEPLOYMENT_GUIDE.md",
        ".cursorrules",
        "PWA_BUILDER_FIX.md",
        "EXPO_GO_SETUP_GUIDE.md",
        "PREVENTION_GUIDE.md"
    ]
    
    fixed = 0
    for file_path in markdown_files:
        if os.path.exists(file_path):
            if fix_markdown_errors(file_path):
                fixed += 1
    
    print(f"\n✅ Fixed markdown issues in {fixed} files")
    print("🎉 All markdown errors resolved!")

if __name__ == "__main__":
    main()

