#!/usr/bin/env bash
# Offline bundle: TT-QuietBox (Blackhole) 2 only (systems/quietbox/quietbox-bh-2)
# plus aibs/compliance (linked from that section's toctree).
# Omits _static/home and unused _images to keep size down.

set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
HTML="$ROOT/core/_build/html"
OUT="$ROOT/TT-QuietBox-BH2-browsable"
ZIP="$ROOT/TT-QuietBox-BH2-browsable.zip"

if [[ ! -d "$HTML/systems/quietbox/quietbox-bh-2" ]]; then
  echo "Build core docs first: cd core && export homepage=index.html && make html" >&2
  exit 1
fi

rm -rf "$OUT" "$ZIP"
mkdir -p "$OUT/_images" "$OUT/systems/quietbox/quietbox-bh-2" "$OUT/aibs"

rsync -a --exclude 'home/' "$HTML/_static/" "$OUT/_static/"

IMGS=(
  placeholder-box-opening.png
  placeholder-removing-side-clips.png
  placeholder-removing-accessories.png
  placeholder-lifting-unit-out-of-box.png
  placeholder-side-workstation.png
  placeholder-connecting-power.png
  placeholder-peripheral-connections.png
  draft-bh-qb2-rear-PSU.png
  placeholder-power-button-closeup.png
  screencap-tt-smi-qb2.png
  screencap-tt-studio-is-ready.png
  screencap-tt-studio-select-model.png
  screencap-tt-studio-deploy-model.png
  draft-bh-qb-2-system-iso-view.png
  draft-bh-qb-2-system-rear-view.png
  draft-bh-qb2-topology.png
)
for f in "${IMGS[@]}"; do
  if [[ ! -f "$HTML/_images/$f" ]]; then
    echo "Missing image: $HTML/_images/$f" >&2
    exit 1
  fi
  cp "$HTML/_images/$f" "$OUT/_images/"
done

cp "$HTML/systems/index.html" "$OUT/systems/"
cp "$HTML/systems/quietbox/quietbox-bh-2/"*.html "$OUT/systems/quietbox/quietbox-bh-2/"
cp "$HTML/aibs/compliance.html" "$OUT/aibs/"

cat > "$OUT/index.html" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Tenstorrent docs — TT-QuietBox (Blackhole) 2 (offline)</title>
  <meta http-equiv="refresh" content="0; url=systems/quietbox/quietbox-bh-2/index.html" />
</head>
<body>
  <p><a href="systems/quietbox/quietbox-bh-2/index.html">Open TT-QuietBox (Blackhole) 2</a></p>
</body>
</html>
EOF

cat > "$OUT/README.txt" << 'EOF'
TT-QuietBox (Blackhole) 2 — offline bundle

Start here: systems/quietbox/quietbox-bh-2/index.html

Includes: setup, specifications, support, and Regulatory Compliance (linked from this section).
Sidebar links to other parts of the full docs site will not work offline.

Regenerate: ./scripts/package-quietbox-bh-2-offline.sh (after `make html` in core/)
EOF

( cd "$ROOT" && zip -r -q "$ZIP" "$(basename "$OUT")" )
rm -rf "$OUT"
echo "Created: $ZIP ($(du -h "$ZIP" | cut -f1))"
