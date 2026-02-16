#!/usr/bin/env bash
set -euo pipefail

# Usage:
#   ./tools/changelog-bundle.sh
#   ./tools/changelog-bundle.sh --base origin/main --lib projects/f-flow --out dist/changelog-bundles
#
# Run this from your FEATURE branch. It will compare BASE..HEAD.

BASE="origin/main"
LIB_PATH=""                 # e.g. projects/f-flow (optional but recommended)
OUT_DIR="dist/changelog-bundles"
RENAME_THRESHOLD="50%"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --base) BASE="$2"; shift 2;;
    --lib)  LIB_PATH="$2"; shift 2;;
    --out)  OUT_DIR="$2"; shift 2;;
    --renames) RENAME_THRESHOLD="$2"; shift 2;;
    -h|--help)
      echo "Usage: $0 [--base origin/main] [--lib projects/<lib>] [--out dist/changelog-bundles] [--renames 50%]"
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

git rev-parse "$BASE" >/dev/null 2>&1 || {
  echo "ERROR: base ref '$BASE' not found. Try: git fetch --all --prune"
  exit 1
}

BRANCH="$(git branch --show-current || true)"
HEAD_SHA="$(git rev-parse --short HEAD)"
BASE_SHA="$(git rev-parse --short "$BASE")"
DATE_UTC="$(date -u +%Y%m%d-%H%M%S)"

BUNDLE_NAME="changelog_bundle_${DATE_UTC}_${BRANCH:-detached}_${HEAD_SHA}"
WORK_DIR="$(mktemp -d)"
cleanup() { rm -rf "$WORK_DIR"; }
trap cleanup EXIT

mkdir -p "$OUT_DIR/$BUNDLE_NAME"
BUNDLE_DIR="$OUT_DIR/$BUNDLE_NAME"

# ---------- core metadata ----------
cat > "$BUNDLE_DIR/ABOUT.md" <<EOF
# Changelog bundle

This bundle contains everything needed to generate high-quality release notes for a FEATURE BRANCH.

- Base ref: $BASE ($BASE_SHA)
- Head: HEAD ($HEAD_SHA)
- Branch: ${BRANCH:-detached}

Compare range:
- commits: $BASE..HEAD
- diff:    $BASE...HEAD
EOF

echo "$BASE" > "$BUNDLE_DIR/base_ref.txt"
git rev-parse "$BASE" > "$BUNDLE_DIR/base_sha.txt"
git rev-parse HEAD > "$BUNDLE_DIR/head_sha.txt"
git status --porcelain=v1 > "$BUNDLE_DIR/status.txt" || true

# ---------- commits ----------
git log --no-decorate --date=iso --pretty=format:"%h %ad %an %s" "$BASE"..HEAD > "$BUNDLE_DIR/commits.txt" || true

# ---------- diffs ----------
git diff --patch --find-renames="$RENAME_THRESHOLD" "$BASE"...HEAD > "$BUNDLE_DIR/pr.patch"
git diff --stat  --find-renames="$RENAME_THRESHOLD" "$BASE"...HEAD > "$BUNDLE_DIR/pr.stat"
git diff --name-status --find-renames="$RENAME_THRESHOLD" "$BASE"...HEAD > "$BUNDLE_DIR/changed-files.name-status.txt"
git diff --numstat     --find-renames="$RENAME_THRESHOLD" "$BASE"...HEAD > "$BUNDLE_DIR/changed-files.numstat.txt"
git diff --name-only   --find-renames="$RENAME_THRESHOLD" "$BASE"...HEAD > "$BUNDLE_DIR/changed-files.paths.txt"

# ---------- public-api snapshots ----------
PUBLIC_API_FILES=()

if [[ -n "$LIB_PATH" ]]; then
  if [[ -f "$LIB_PATH/src/public-api.ts" ]]; then
    PUBLIC_API_FILES+=("$LIB_PATH/src/public-api.ts")
  else
    echo "ERROR: '$LIB_PATH/src/public-api.ts' not found"
    exit 1
  fi
else
  while IFS= read -r f; do PUBLIC_API_FILES+=("$f"); done < <(git ls-files "projects/*/src/public-api.ts")
fi

mkdir -p "$BUNDLE_DIR/public-api"
idx=0
for f in "${PUBLIC_API_FILES[@]}"; do
  idx=$((idx+1))
  safe="${f//\//_}"; safe="${safe//./_}"

  if git cat-file -e "$BASE:$f" 2>/dev/null; then
    git show "$BASE:$f" > "$BUNDLE_DIR/public-api/${idx}_${safe}.before.ts"
  else
    echo "// File did not exist at base: $f" > "$BUNDLE_DIR/public-api/${idx}_${safe}.before.ts"
  fi

  if git cat-file -e "HEAD:$f" 2>/dev/null; then
    git show "HEAD:$f" > "$BUNDLE_DIR/public-api/${idx}_${safe}.after.ts"
  else
    echo "// File missing at HEAD: $f" > "$BUNDLE_DIR/public-api/${idx}_${safe}.after.ts"
  fi
done

# ---------- helpful extras ----------
for extra in README.md CHANGELOG.md package.json angular.json nx.json tsconfig.json; do
  if [[ -f "$extra" ]]; then
    cp "$extra" "$BUNDLE_DIR/" || true
  fi
done

# ---------- analyzer: generates release_facts + prompt ----------
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
node "$SCRIPT_DIR/changelog-analyze.mjs" "$BUNDLE_DIR" >/dev/null

# ---------- archive ----------
tar -czf "$OUT_DIR/${BUNDLE_NAME}.tgz" -C "$OUT_DIR" "$BUNDLE_NAME"

echo "Bundle folder:"
echo "  $BUNDLE_DIR"
echo ""
echo "Bundle archive:"
echo "  $OUT_DIR/${BUNDLE_NAME}.tgz"
echo ""
echo "Most important files for LLM:"
echo "  $BUNDLE_DIR/release_facts.md"
echo "  $BUNDLE_DIR/PROMPT_RELEASE_NOTES.md"
