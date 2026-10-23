#!/usr/bin/env bash
# Linux/macOS launcher for Autonomous Data Analyst.
# Windows users: use run.bat instead.
set -euo pipefail

cd "$(dirname "$(readlink -f "$0")")"

if command -v python3 >/dev/null 2>&1; then
    exec python3 serve.py "$@"
elif command -v python >/dev/null 2>&1; then
    exec python serve.py "$@"
else
    echo "[!] Python 3 is required. Install it with:"
    echo "    sudo apt install python3"
    exit 1
fi
