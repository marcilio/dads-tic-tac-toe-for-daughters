#!/bin/bash
# Runs ESLint after Claude edits or creates a file.
# Claude Code passes the tool input as JSON on stdin.
# Only lints JS/JSX files — skips CSS, JSON, etc.

FILE=$(python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    print(data.get('tool_input', {}).get('file_path', ''), end='')
except:
    pass
" 2>/dev/null)

case "$FILE" in
  *.js|*.jsx)
    echo "ESLint: $FILE"
    cd /home/marciliomendonca/tic-tac-toe && npx eslint "$FILE" 2>&1
    ;;
esac
