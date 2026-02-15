#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./tools/release-bundle.sh
#   ./tools/release-bundle.sh --base origin/main --lib projects/f-flow --out dist/release-bundles
#
# Requirements: git, tar

BASE="origin/main"
LIB_PATH=""           # e.g. projects/f-flow
OUT_DIR="dist/release-bundles"
RENAME_THRESHOLD="50%"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --base) BASE="$2"; shift 2;;
    --lib) LIB_PATH="$2"; shift 2;;
    --out) OUT_DIR="$2"; shift 2;;
    --renames) RENAME_THRESHOLD="$2"; shift 2;;
    -h|--help)
      echo "Usage: $0 [--base origin/main] [--lib projects/<lib>] [--out dist/release-bundles] [--renames 50%]"
      exit 0
      ;;
    *)
      echo "Unknown arg: $1"
      exit 1
      ;;
  esac
done

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "ERROR: run from inside a git repo"
  exit 1
fi

# Ensure base exists locally
git rev-parse "$BASE" >/dev/null 2>&1 || {
  echo "ERROR: base ref '$BASE' not found. Try: git fetch --all --prune"
  exit 1
}

HEAD_SHA="$(git rev-parse --short HEAD)"
DATE_UTC="$(date -u +%Y%m%d-%H%M%S)"
BUNDLE_NAME="release_bundle_${DATE_UTC}_${HEAD_SHA}"
WORK_DIR="$(mktemp -d)"

cleanup() { rm -rf "$WORK_DIR"; }
trap cleanup EXIT

mkdir -p "$OUT_DIR"

# Find public-api.ts automatically if lib not provided
# Prefer: projects/*/src/public-api.ts ; fallback: **/public-api.ts
PUBLIC_API_FILES=()

if [[ -n "$LIB_PATH" ]]; then
  if [[ -f "$LIB_PATH/src/public-api.ts" ]]; then
    PUBLIC_API_FILES+=("$LIB_PATH/src/public-api.ts")
  else
    echo "ERROR: '$LIB_PATH/src/public-api.ts' not found"
    exit 1
  fi
else
  # common Angular workspace pattern
  while IFS= read -r f; do PUBLIC_API_FILES+=("$f"); done < <(git ls-files "projects/*/src/public-api.ts")
  if [[ ${#PUBLIC_API_FILES[@]} -eq 0 ]]; then
    while IFS= read -r f; do PUBLIC_API_FILES+=("$f"); done < <(git ls-files "**/public-api.ts")
  fi
fi

if [[ ${#PUBLIC_API_FILES[@]} -eq 0 ]]; then
  echo "ERROR: couldn't find any public-api.ts. Pass --lib projects/<lib>."
  exit 1
fi

# Metadata
echo "$BASE" > "$WORK_DIR/base_ref.txt"
git rev-parse "$BASE" > "$WORK_DIR/base_sha.txt"
git rev-parse HEAD > "$WORK_DIR/head_sha.txt"
git status --porcelain=v1 > "$WORK_DIR/status.txt" || true

# Commits
git log --oneline --no-decorate "$BASE"..HEAD > "$WORK_DIR/commits.txt" || true

# Diff (PR diff)
git diff --patch --stat --find-renames="$RENAME_THRESHOLD" "$BASE"...HEAD > "$WORK_DIR/pr.patch"
git diff --stat --find-renames="$RENAME_THRESHOLD" "$BASE"...HEAD > "$WORK_DIR/pr.stat"

# Public API before/after snapshots
mkdir -p "$WORK_DIR/public-api"

idx=0
for f in "${PUBLIC_API_FILES[@]}"; do
  idx=$((idx+1))
  safe_name="${f//\//_}"
  safe_name="${safe_name//./_}"

  # before
  if git cat-file -e "$BASE:$f" 2>/dev/null; then
    git show "$BASE:$f" > "$WORK_DIR/public-api/${idx}_${safe_name}.before.ts"
  else
    echo "// File did not exist at base: $f" > "$WORK_DIR/public-api/${idx}_${safe_name}.before.ts"
  fi

  # after
  if git cat-file -e "HEAD:$f" 2>/dev/null; then
    git show "HEAD:$f" > "$WORK_DIR/public-api/${idx}_${safe_name}.after.ts"
  else
    echo "// File missing at HEAD: $f" > "$WORK_DIR/public-api/${idx}_${safe_name}.after.ts"
  fi
done

# Helpful extras (best-effort)
# include README + package configs if present
for extra in README.md CHANGELOG.md package.json angular.json nx.json; do
  if [[ -f "$extra" ]]; then
    cp "$extra" "$WORK_DIR/" || true
  fi
done

# If lib path provided, include its package metadata (best-effort)
if [[ -n "$LIB_PATH" ]]; then
  for extra in "$LIB_PATH/package.json" "$LIB_PATH/ng-package.json" "$LIB_PATH/project.json"; do
    if [[ -f "$extra" ]]; then
      mkdir -p "$WORK_DIR/lib-meta"
      cp "$extra" "$WORK_DIR/lib-meta/" || true
    fi
  done
fi

# Bundle
tar -czf "$OUT_DIR/${BUNDLE_NAME}.tgz" -C "$WORK_DIR" .

echo "Release bundle created:"
echo "   $OUT_DIR/${BUNDLE_NAME}.tgz"
echo ""
