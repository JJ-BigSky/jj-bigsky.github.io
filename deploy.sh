#!/usr/bin/env bash
# Deploy Big Sky Systems static site to AWS S3 (+ optional CloudFront invalidation).
#
# Usage:
#   ./deploy.sh <s3-bucket-name> [cloudfront-distribution-id] [--dryrun]
#
# Or via environment variables:
#   S3_BUCKET=my-bucket CF_DISTRIBUTION_ID=E1234567890 ./deploy.sh

set -euo pipefail

BUCKET="${S3_BUCKET:-}"
CF_ID="${CF_DISTRIBUTION_ID:-}"
EXTRA_ARGS=()

for arg in "$@"; do
  case "$arg" in
    --dryrun|--dry-run)
      EXTRA_ARGS+=("--dryrun")
      ;;
    *)
      if [[ -z "$BUCKET" ]]; then
        BUCKET="${arg#s3://}"
      elif [[ -z "$CF_ID" ]]; then
        CF_ID="$arg"
      fi
      ;;
  esac
done

if [[ -z "$BUCKET" ]]; then
  echo "Usage: ./deploy.sh <s3-bucket-name> [cloudfront-distribution-id] [--dryrun]" >&2
  exit 1
fi

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

EXCLUDES=(
  --exclude ".git/*"
  --exclude ".claude/*"
  --exclude "content/*"
  --exclude "docs/*"
  --exclude "tools/*"
  --exclude "_shots/*"
  --exclude ".DS_Store"
  --exclude "*/.DS_Store"
  --exclude ".nojekyll"
  --exclude "CLAUDE.md"
  --exclude "DESIGN_LANGUAGE.md"
  --exclude "README.md"
  --exclude "netlify.toml"
  --exclude "vercel.json"
  --exclude "deploy.sh"
)

echo "==> Syncing HTML, sitemap, and robots.txt to s3://$BUCKET ..."
aws s3 sync . "s3://$BUCKET" \
  --delete \
  "${EXCLUDES[@]}" \
  --exclude "assets/*" \
  --cache-control "public, max-age=300, must-revalidate" \
  "${EXTRA_ARGS[@]+"${EXTRA_ARGS[@]}"}"

echo "==> Syncing static assets (/assets/*) with 7-day cache-control ..."
aws s3 sync ./assets "s3://$BUCKET/assets" \
  --delete \
  --exclude ".DS_Store" \
  --exclude "*/.DS_Store" \
  --cache-control "public, max-age=604800" \
  "${EXTRA_ARGS[@]+"${EXTRA_ARGS[@]}"}"

if [[ -n "$CF_ID" ]]; then
  if [[ "${#EXTRA_ARGS[@]}" -gt 0 ]]; then
    echo "==> [dryrun] Skipping CloudFront invalidation for distribution $CF_ID"
  else
    echo "==> Creating CloudFront invalidation on $CF_ID ..."
    aws cloudfront create-invalidation \
      --distribution-id "$CF_ID" \
      --paths "/*" \
      --output text
  fi
fi

echo "==> Done."
