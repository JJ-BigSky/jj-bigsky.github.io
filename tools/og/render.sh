#!/bin/sh
# Render one OG image: tools/og/render.sh <slug> "<eyebrow>" "<headline>" "<subtitle>"
# Needs the local preview server on :8741 and Google Chrome. Output: assets/img/og/<slug>.png
set -e
CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
mkdir -p _shots assets/img/og
sed -e "s|__EYE__|$2|" -e "s|__H1__|$3|" -e "s|__SUB__|$4|" tools/og/template.html > "_shots/og-$1.html"
"$CH" --headless=new --disable-gpu --hide-scrollbars --virtual-time-budget=3000 --no-first-run --user-data-dir="/tmp/og-$1" --window-size=1200,630 --screenshot="$PWD/assets/img/og/$1.png" "http://localhost:8741/_shots/og-$1.html" 2>/dev/null
rm -rf "_shots/og-$1.html" "/tmp/og-$1"
