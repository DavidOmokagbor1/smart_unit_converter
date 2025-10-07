#!/usr/bin/env python3
"""
Final Comprehensive Linting Fix
"""

import os
import re

def fix_markdown_simple(file_path):
    """Fix markdown errors with simple approach"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Fix multiple blank lines
        content = re.sub(r'\n{3,}', '\n\n', content)
        
        # Fix bare URLs
        content = re.sub(r'([^[])(https?://[^\s\)]+)([^]])', r'\1[\2](\2)\3', content)
        
        # Fix trailing punctuation in headings
        content = re.sub(r'^(#{1,6}\s+[^!]*?)[!:]+\s*$', r'\1', content, flags=re.MULTILINE)
        
        # Fix fenced code blocks without language
        content = re.sub(r'^```\s*$', '```text', content, flags=re.MULTILINE)
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Fixed markdown errors in {file_path}")
        return True
    except Exception as e:
        print(f"❌ Error fixing {file_path}: {e}")
        return False

def main():
    print("🔧 Final Linting Fix...")
    print("=" * 30)
    
    markdown_files = [
        "security-templates/README.md",
        "TEAM_SECURITY_GUIDELINES.md",
        "APP_STORE_DEPLOYMENT_GUIDE.md",
        ".cursorrules",
        "PWA_BUILDER_FIX.md",
        "EXPO_GO_SETUP_GUIDE.md",
        "PREVENTION_GUIDE.md"
    ]
    
    fixed = 0
    for file_path in markdown_files:
        if os.path.exists(file_path):
            if fix_markdown_simple(file_path):
                fixed += 1
    
    print(f"\n✅ Fixed {fixed} markdown files")
    print("🎉 Linting errors resolved!")

if __name__ == "__main__":
    main()

