#!/usr/bin/env bash

set -euo pipefail

PINNED_HUGO_VERSION="0.157.0"
BUILD_DIR=".vercel-hugo"

rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"

echo "Downloading Hugo ${PINNED_HUGO_VERSION}..."
ARCHIVES=(
  "hugo_${PINNED_HUGO_VERSION}_linux-amd64.tar.gz"
  "hugo_extended_${PINNED_HUGO_VERSION}_linux-amd64.tar.gz"
  "hugo_${PINNED_HUGO_VERSION}_Linux-64bit.tar.gz"
  "hugo_extended_${PINNED_HUGO_VERSION}_Linux-64bit.tar.gz"
)

downloaded_archive=""
for archive in "${ARCHIVES[@]}"; do
  download_url="https://github.com/gohugoio/hugo/releases/download/v${PINNED_HUGO_VERSION}/${archive}"
  if curl -fsSL "${download_url}" -o "${BUILD_DIR}/${archive}"; then
    downloaded_archive="${archive}"
    break
  fi
done

if [[ -z "${downloaded_archive}" ]]; then
  echo "Failed to download a Hugo release archive for version ${PINNED_HUGO_VERSION}" >&2
  exit 1
fi

tar -xzf "${BUILD_DIR}/${downloaded_archive}" -C "${BUILD_DIR}"

echo "Using Hugo binary:"
"${BUILD_DIR}/hugo" version

HUGO_ENVIRONMENT=production "${BUILD_DIR}/hugo" --gc --minify
