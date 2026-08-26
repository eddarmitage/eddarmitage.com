#!/usr/bin/env bash
# Fails if any image under content/ or static/ exceeds MAX_DIMENSION pixels
# on its longest edge - a guardrail against accidentally committing
# full-size source photos into the repo. Requires ImageMagick's `identify`
# (preinstalled on GitHub-hosted ubuntu-latest runners).
set -euo pipefail

MAX_DIMENSION=2000
FAILED=0

while IFS= read -r -d '' file; do
  dimensions=$(identify -format "%w %h\n" "$file" 2>/dev/null | head -n1)
  if [ -z "$dimensions" ]; then
    echo "warning: could not read dimensions for $file" >&2
    continue
  fi

  width=${dimensions% *}
  height=${dimensions#* }
  longest=$(( width > height ? width : height ))

  if [ "$longest" -gt "$MAX_DIMENSION" ]; then
    echo "::error file=${file}::Image exceeds ${MAX_DIMENSION}px on its longest edge (${width}x${height})"
    FAILED=1
  fi
done < <(find content static -type f \( \
    -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \
    -o -iname '*.webp' -o -iname '*.gif' \
  \) -print0)

if [ "$FAILED" -ne 0 ]; then
  echo "One or more images exceed the ${MAX_DIMENSION}px limit on their longest edge." >&2
  exit 1
fi

echo "All images are within the ${MAX_DIMENSION}px limit."
