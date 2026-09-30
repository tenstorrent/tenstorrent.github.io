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
  exit 0
fi

echo "QuietBox 2 sources changed vs ${BASE_REF}:"
printf '%s' "$changed_sources" | sed '/^$/d' | sed 's/^/  - /'

fail=0
if [ "$pdf_changed" -eq 0 ]; then
  echo
  echo "ERROR: ${PDF} was not updated in this change."
  fail=1
fi

if [ "$version_line_changed" -eq 0 ]; then
  echo
  echo "ERROR: the Version / Last Updated line in ${INDEX} did not change."
  echo "An unrelated edit to that file is not enough."
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  echo
  echo "Regenerate the PDF from the web sources. The generator lives outside"
  echo "this repo; instructions:"
  echo "  https://github.com/tenstorrent/tenstorrent.github.io/blob/main/${GENERATOR_DOC}"
  echo "It writes the PDF and the matching index version line. Commit both."
  exit 1
fi

echo
echo "QuietBox 2 PDF sync check passed (PDF + Version / Last Updated line updated)."
