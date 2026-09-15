#!/usr/bin/env bash
# Fail if QuietBox 2 web source pages changed without updating the hosted PDF.
#
# Usage:
#   scripts/check_quietbox2_pdf_sync.sh [base-ref]
#
# Examples:
#   scripts/check_quietbox2_pdf_sync.sh origin/main
#   scripts/check_quietbox2_pdf_sync.sh "$PR_BASE_SHA"

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BASE_REF="${1:-origin/main}"

SOURCES=(
  "core/systems/quietbox/quietbox-bh-2/specifications.md"
  "core/systems/quietbox/quietbox-bh-2/setup.md"
  "core/systems/quietbox/quietbox-bh-2/compliance-qb2.md"
)
PDF="core/systems/quietbox/quietbox-bh-2/tt-quietbox-2-user-guide.pdf"
INDEX="core/systems/quietbox/quietbox-bh-2/index.rst"

if ! git rev-parse --verify "$BASE_REF" >/dev/null 2>&1; then
  echo "Base ref not found: $BASE_REF"
  echo "Fetch it first (e.g. git fetch origin main) or pass a commit SHA."
  exit 1
fi

CHANGED="$(git diff --name-only "${BASE_REF}...HEAD")"

source_changed=0
pdf_changed=0
index_changed=0
changed_sources=""

while IFS= read -r path; do
  [ -z "$path" ] && continue
  for src in "${SOURCES[@]}"; do
    if [ "$path" = "$src" ]; then
      source_changed=1
      changed_sources="${changed_sources}${path}"$'\n'
    fi
  done
  if [ "$path" = "$PDF" ]; then
    pdf_changed=1
  fi
  if [ "$path" = "$INDEX" ]; then
    index_changed=1
  fi
done <<EOF
${CHANGED}
EOF

if [ "$source_changed" -eq 0 ]; then
  echo "QuietBox 2 PDF sync check: no source-page changes vs ${BASE_REF}."
  exit 0
fi

echo "QuietBox 2 source pages changed vs ${BASE_REF}:"
printf '%s' "$changed_sources" | sed '/^$/d' | sed 's/^/  - /'

fail=0
if [ "$pdf_changed" -eq 0 ]; then
  echo
  echo "ERROR: ${PDF} was not updated in this change."
  echo "Regenerate it from the web sources (external qb2-user-guide-generator),"
  echo "then include the new PDF in this PR."
  fail=1
fi

if [ "$index_changed" -eq 0 ]; then
  echo
  echo "ERROR: ${INDEX} was not updated in this change."
  echo "Bump the PDF Version / Last Updated line on the QuietBox 2 index"
  echo "(same pattern as the Galaxy user-guide links)."
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  exit 1
fi

echo
echo "QuietBox 2 PDF sync check passed (PDF + index metadata updated)."
