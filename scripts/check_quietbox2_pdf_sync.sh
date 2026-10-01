#!/usr/bin/env bash
# Fail if QuietBox 2 web sources changed without updating the hosted PDF
# and the index Version / Last Updated line.
#
# Source of truth for which files count: anything under the QuietBox 2
# directory except the PDF and index themselves (markdown and figure images).
#
# Usage:
#   scripts/check_quietbox2_pdf_sync.sh [base-ref]
#
# CI passes HEAD^1. On the pull_request merge checkout, that is the base
# this PR was tested against, so the diff is only this PR's changes.
# Locally, pass the branch you are comparing to (default: origin/main).

set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

BASE_REF="${1:-origin/main}"

QB2_DIR="core/systems/quietbox/quietbox-bh-2"
PDF="${QB2_DIR}/tt-quietbox-2-user-guide.pdf"
INDEX="${QB2_DIR}/index.rst"
GENERATOR_DOC="scripts/quietbox2_pdf.md"

if ! git rev-parse -q --verify "${BASE_REF}^{commit}" >/dev/null; then
  echo "Base ref not found: $BASE_REF"
  echo "Fetch it first (e.g. git fetch origin main) or pass a commit SHA."
  exit 1
fi

CHANGED="$(git diff --name-only "${BASE_REF}...HEAD")"

source_changed=0
pdf_changed=0
changed_sources=""

while IFS= read -r path; do
  [ -z "$path" ] && continue
  case "$path" in
    "${PDF}")
      pdf_changed=1
      ;;
    "${INDEX}")
      ;;
    "${QB2_DIR}"/*)
      source_changed=1
      changed_sources="${changed_sources}${path}"$'\n'
      ;;
  esac
done <<EOF
${CHANGED}
EOF

version_line_changed=0
if git diff -U0 "${BASE_REF}" HEAD -- "$INDEX" | grep -Eq '^\+.*Version .+ Last Updated:'; then
  version_line_changed=1
fi

if [ "$source_changed" -eq 0 ]; then
  echo "QuietBox 2 PDF sync check: no source changes vs ${BASE_REF}."
else
  echo "QuietBox 2 sources changed vs ${BASE_REF}:"
  printf '%s' "$changed_sources" | sed '/^$/d' | sed 's/^/  - /'
fi

fail=0
if [ "$source_changed" -ne 0 ] && [ "$pdf_changed" -eq 0 ]; then
  echo
  echo "ERROR: ${PDF} was not updated in this change."
  fail=1
fi

if [ "$source_changed" -ne 0 ] && [ "$version_line_changed" -eq 0 ]; then
  echo
  echo "ERROR: the Version / Last Updated line in ${INDEX} did not change."
  echo "An unrelated edit to that file is not enough."
  fail=1
fi

# The generator writes one version and one date into both places. Compare the
# committed files so a hand edit cannot leave them different.
cover_text=""
if command -v pdftotext >/dev/null 2>&1; then
  cover_text="$(pdftotext -f 1 -l 1 -q "$PDF" - || true)"
else
  py="${ROOT}/.venv/bin/python"
  if [ ! -x "$py" ]; then
    py="python3"
  fi
  cover_text="$("$py" - "$PDF" 2>/dev/null <<'PY' || true
import sys
from pypdf import PdfReader
print(PdfReader(sys.argv[1]).pages[0].extract_text() or "")
PY
)"
fi

pdf_version="$(printf '%s\n' "$cover_text" | sed -n 's/.*Version \([0-9][0-9]*\.[0-9][0-9]*\).*/\1/p' | head -1)"
pdf_date="$(printf '%s\n' "$cover_text" | sed -n 's/.*\([A-Z][a-z]* [0-9][0-9]*, [0-9][0-9][0-9][0-9]\).*/\1/p' | head -1)"
index_line="$(grep -E 'Version .+ Last Updated:' "$INDEX" | head -1 || true)"
index_version="$(printf '%s\n' "$index_line" | sed -n 's/.*Version \([0-9][0-9]*\.[0-9][0-9]*\).*/\1/p')"
index_date="$(printf '%s\n' "$index_line" | sed -n 's/.*Last Updated: \(.*\)/\1/p' | sed 's/[[:space:]]*$//')"

if [ -z "$pdf_version" ] || [ -z "$index_version" ] || [ "$pdf_version" != "$index_version" ] || [ "$pdf_date" != "$index_date" ]; then
  echo
  echo "ERROR: PDF cover and index version line do not match."
  echo "  PDF:   Version ${pdf_version:-?} / ${pdf_date:-?}"
  echo "  Index: Version ${index_version:-?} / ${index_date:-?}"
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  echo
  echo "Regenerate the PDF from the web sources. The generator lives outside"
  echo "this repo; instructions:"
  echo "  https://github.com/tenstorrent/tenstorrent.github.io/blob/main/${GENERATOR_DOC}"
  echo "One run writes the same Version and date onto the PDF cover and the index."
  exit 1
fi

echo
echo "QuietBox 2 PDF sync check passed (Version ${index_version}, ${index_date})."
