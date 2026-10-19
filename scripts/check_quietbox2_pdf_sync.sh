#!/usr/bin/env bash
# Fail if QuietBox 2 *PDF* sources changed without updating the hosted PDF
# and the index Generated date line.
#
# The PDF is built from specifications, setup, and compliance only. Other
# QuietBox 2 pages (welcome, remote-access, support, …) do not require a
# PDF refresh. Figure images count only when those three pages reference them.
#
# There is no version number — only a generation date on the PDF cover and
# the index download line. The check fails if those dates disagree.
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

SOURCE_MD=(
  "${QB2_DIR}/specifications.md"
  "${QB2_DIR}/setup.md"
  "${QB2_DIR}/compliance-qb2.md"
)

if ! git rev-parse -q --verify "${BASE_REF}^{commit}" >/dev/null; then
  echo "Base ref not found: $BASE_REF"
  echo "Fetch it first (e.g. git fetch origin main) or pass a commit SHA."
  exit 1
fi

# Collect image paths referenced by the three PDF source pages (HEAD and base),
# so replacements of a figure file still require a PDF refresh even when the
# markdown line is unchanged.
collect_image_refs() {
  local text="$1"
  # grep exits 1 when there are no matches; do not fail the script (set -e).
  printf '%s' "$text" \
    | grep -oiE '(\./)?[A-Za-z0-9._/-]+\.(jpg|jpeg|png|gif|svg|webp)' \
    | sed 's|^\./||' \
    | while IFS= read -r rel; do
        [ -z "$rel" ] && continue
        # Only count images that live in the QuietBox 2 directory.
        case "$rel" in
          */*) continue ;;
        esac
        printf '%s\n' "${QB2_DIR}/${rel}"
      done || true
}

PDF_INPUT_PATHS="$(printf '%s\n' "${SOURCE_MD[@]}")"
for md in "${SOURCE_MD[@]}"; do
  if [ -f "$md" ]; then
    PDF_INPUT_PATHS="${PDF_INPUT_PATHS}"$'\n'"$(collect_image_refs "$(cat "$md")")"
  fi
  if git cat-file -e "${BASE_REF}:${md}" 2>/dev/null; then
    PDF_INPUT_PATHS="${PDF_INPUT_PATHS}"$'\n'"$(collect_image_refs "$(git show "${BASE_REF}:${md}")")"
  fi
done

# Unique, non-empty paths.
PDF_INPUT_PATHS="$(printf '%s\n' "$PDF_INPUT_PATHS" | sed '/^$/d' | sort -u)"

is_pdf_input() {
  local path="$1"
  printf '%s\n' "$PDF_INPUT_PATHS" | grep -Fxq -- "$path"
}

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
    *)
      if is_pdf_input "$path"; then
        source_changed=1
        changed_sources="${changed_sources}${path}"$'\n'
      fi
      ;;
  esac
done <<EOF
${CHANGED}
EOF

date_line_changed=0
if git diff -U0 "${BASE_REF}" HEAD -- "$INDEX" | grep -Eq '^\+.*(Generated:|Last Updated:)'; then
  date_line_changed=1
fi

if [ "$source_changed" -eq 0 ]; then
  echo "QuietBox 2 PDF sync check: no PDF-relevant source changes vs ${BASE_REF}."
  echo "(PDF sources: specifications.md, setup.md, compliance-qb2.md, and images they reference.)"
else
  echo "QuietBox 2 PDF sources changed vs ${BASE_REF}:"
  printf '%s' "$changed_sources" | sed '/^$/d' | sed 's/^/  - /'
fi

fail=0
if [ "$source_changed" -ne 0 ] && [ "$pdf_changed" -eq 0 ]; then
  echo
  echo "ERROR: ${PDF} was not updated in this change."
  fail=1
fi

if [ "$source_changed" -ne 0 ] && [ "$date_line_changed" -eq 0 ]; then
  echo
  echo "ERROR: the Generated date line in ${INDEX} did not change."
  echo "An unrelated edit to that file is not enough."
  fail=1
fi

# Compare generation dates on the PDF cover and the index download line.
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

# Cover shows a bare date line (Month D, YYYY). Index uses "Generated: …".
DATE_RE='(January|February|March|April|May|June|July|August|September|October|November|December) [0-9][0-9]*, [0-9][0-9][0-9][0-9]'
pdf_date="$(printf '%s\n' "$cover_text" | grep -Eo "$DATE_RE" | head -1 || true)"
index_line="$(grep -E 'tt-quietbox-2-user-guide\.pdf|Generated:' "$INDEX" | head -1 || true)"
index_date="$(printf '%s\n' "$index_line" | grep -Eo "$DATE_RE" | head -1 || true)"

if [ -z "$pdf_date" ] || [ -z "$index_date" ] || [ "$pdf_date" != "$index_date" ]; then
  echo
  echo "ERROR: PDF cover and index generation dates do not match."
  echo "  PDF cover: ${pdf_date:-?}"
  echo "  Index:     ${index_date:-?}"
  fail=1
fi

if [ "$fail" -ne 0 ]; then
  echo
  echo "Regenerate the PDF from the web sources. The generator lives outside"
  echo "this repo; instructions:"
  echo "  https://github.com/tenstorrent/tenstorrent.github.io/blob/main/${GENERATOR_DOC}"
  echo "  python build_quietbox2_user_guide.py --force"
  echo "One run stamps today's date on the PDF cover and the index download line."
  exit 1
fi

echo
echo "QuietBox 2 PDF sync check passed (Generated: ${index_date})."
