#!/bin/bash
set -euo pipefail

# GitHub Pages serves static files and falls back to 404.html. The docs pages are
# prerendered and served directly; the landing and playground routes render on
# the client, so the CSR shell must answer the root and any unmatched path. The
# application builder emits it as index.csr.html; expose it as index.html/404.html.

BROWSER="${1:-dist/demo/browser}"
SHELL_HTML="$BROWSER/index.csr.html"
[[ -f "$SHELL_HTML" ]] || { echo "stage-ghpages: expected CSR shell at $SHELL_HTML" >&2; exit 1; }
cp -f "$SHELL_HTML" "$BROWSER/index.html"
cp -f "$SHELL_HTML" "$BROWSER/404.html"
echo "stage-ghpages: staged index.html and 404.html"
