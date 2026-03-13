#!/usr/bin/env bash

set -euo pipefail

HUGO_VERSION="${HUGO_VERSION:-0.157.0}"
BUILD_DIR=".vercel-hugo"
ARCHIVE="hugo_extended_${HUGO_VERSION}_linux-amd64.tar.gz"
DOWNLOAD_URL="https://github.com/gohugoio/hugo/releases/download/v${HUGO_VERSION}/${ARCHIVE}"

rm -rf "${BUILD_DIR}"
mkdir -p "${BUILD_DIR}"

echo "Downloading Hugo ${HUGO_VERSION}..."
curl -fsSL "${DOWNLOAD_URL}" -o "${BUILD_DIR}/${ARCHIVE}"
tar -xzf "${BUILD_DIR}/${ARCHIVE}" -C "${BUILD_DIR}"

echo "Using Hugo binary:"
"${BUILD_DIR}/hugo" version

HUGO_ENVIRONMENT=production "${BUILD_DIR}/hugo" --gc --minify
