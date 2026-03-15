#!/usr/bin/env bash

set -euo pipefail

HUGO_BIN="${HUGO_BIN:-hugo}"

echo "Checking for publishable future-dated posts..."

if ! output="$("${HUGO_BIN}" list future)"; then
  echo "Failed to run '${HUGO_BIN} list future'." >&2
  exit 1
fi

violations="$(printf '%s\n' "${output}" \
  | tail -n +2 \
  | grep '^content/posts/' \
  | grep ',false,' \
  | grep ',page,' \
  | grep -v '/_index\.md,' \
  | grep -v '/index\.md,' \
  || true)"

if [[ -z "${violations}" ]]; then
  echo "Future post check passed: no publishable future-dated posts found."
  exit 0
fi

now="$(date --iso-8601=seconds 2>/dev/null || date)"

echo "Future post check failed: publishable posts scheduled in the future were found." >&2
echo "Current time: ${now}" >&2
echo >&2
printf '%s\n' "${violations}" >&2
echo >&2
echo "Set draft = true, or move date/publishDate to the present or an earlier time before deploying." >&2
exit 1
