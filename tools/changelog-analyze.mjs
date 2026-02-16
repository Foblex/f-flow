#!/usr/bin/env node
import fs from "fs";
import path from "path";

const dir = process.argv[2];
if (!dir) {
  console.error("Usage: node tools/changelog-analyze.mjs <bundleDir>");
  process.exit(1);
}

const read = (p) => (fs.existsSync(p) ? fs.readFileSync(p, "utf8") : "");
const write = (p, s) => {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, s);
};

const baseRef = read(path.join(dir, "base_ref.txt")).trim() || "origin/main";
const baseSha = (read(path.join(dir, "base_sha.txt")).trim() || "").slice(0, 12);
const headSha = (read(path.join(dir, "head_sha.txt")).trim() || "").slice(0, 12);

const commits = read(path.join(dir, "commits.txt")).trim();
const prStat = read(path.join(dir, "pr.stat")).trim();
const nameStatus = read(path.join(dir, "changed-files.name-status.txt")).trim();

const publicApiDir = path.join(dir, "public-api");
const apiFiles = fs.existsSync(publicApiDir) ? fs.readdirSync(publicApiDir) : [];
const before = apiFiles.filter((f) => f.endsWith(".before.ts")).map((f) => read(path.join(publicApiDir, f))).join("\n");
const after  = apiFiles.filter((f) => f.endsWith(".after.ts")).map((f) => read(path.join(publicApiDir, f))).join("\n");

function extractExportLines(txt) {
  const lines = txt.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  return lines.filter((l) => l.startsWith("export "));
}

function diff(a, b) {
  const A = new Set(a);
  const B = new Set(b);
  return {
    added: [...B].filter((x) => !A.has(x)).sort(),
    removed: [...A].filter((x) => !B.has(x)).sort(),
  };
}

const beforeExports = extractExportLines(before);
const afterExports = extractExportLines(after);
const exportsDiff = diff(beforeExports, afterExports);

// simple breaking candidates: removed exports + deleted public-api file changes
const breakingCandidates = [];
for (const x of exportsDiff.removed) breakingCandidates.push(`Removed export: \`${x}\``);

const changed = nameStatus.split(/\r?\n/).filter(Boolean);
for (const row of changed) {
  if (row.includes("public-api.ts") && row.startsWith("D")) breakingCandidates.push(`Deleted public-api.ts: \`${row}\``);
  if (row.includes("public-api.ts") && row.startsWith("R")) breakingCandidates.push(`Renamed public-api.ts: \`${row}\``);
}

const facts = [
  `# Release facts (feature branch vs base)`,
  ``,
  `**Compare:** \`${baseRef}\` (${baseSha || "?"}) → \`HEAD\` (${headSha || "?"})`,
  ``,
  `## High-level diff stats`,
  prStat ? "```text\n" + prStat + "\n```" : "_No pr.stat_",
  ``,
  `## Commits in this branch (base..HEAD)`,
  commits ? "```text\n" + commits + "\n```" : "_No commits_",
  ``,
  `## Public API surface (public-api.ts)`,
  `### Added export lines (${exportsDiff.added.length})`,
  exportsDiff.added.length ? exportsDiff.added.map((x) => `- \`${x}\``).join("\n") : `- None`,
  ``,
  `### Removed export lines (${exportsDiff.removed.length})`,
  exportsDiff.removed.length ? exportsDiff.removed.map((x) => `- \`${x}\``).join("\n") : `- None`,
  ``,
  `## Breaking candidates (auto-detected)`,
  breakingCandidates.length ? breakingCandidates.map((x) => `- ${x}`).join("\n") : `- None from heuristics (still verify in patch)`,
  ``,
  `## Changed files (name-status)`,
  nameStatus ? "```text\n" + nameStatus + "\n```" : "_No changed files_",
  ``,
  `## Notes for the model`,
  `- Do **not** invent API. If uncertain: mark as **Potential breaking change** and cite evidence from patch / exports / selectors.`,
  `- Separate **Public surface** vs **Internal/refactor/tests/tooling**.`,
  `- Treat “final-result events” behavior notes as behavior changes if patch indicates it.`,
  ``,
].join("\n");

write(path.join(dir, "release_facts.md"), facts);

const prompt = `# Task: Generate CHANGELOG for this feature branch

You are given a bundle folder with:
- release_facts.md (precomputed facts, use it first)
- pr.patch, pr.stat
- commits.txt
- public-api/*.before.ts and *.after.ts
- changed-files.* reports

Goal:
Write a high-quality CHANGELOG for the changes in this feature branch compared to ${baseRef}.

Hard requirements:
1) Sections: Added / Changed / Fixed / Deprecated / Removed
2) Separate:
   - Breaking changes (only real breakage)
   - Potential breaking changes (if uncertain, with explanation)
   - Migration notes (before/after snippets if obvious)
3) Distinguish PUBLIC surface vs internal/refactor/tests/tooling.
4) Short, technical, no water.
5) Don’t invent anything.

Output format:
# Release notes
## Added
## Changed
## Fixed
## Deprecated
## Removed
## Breaking changes
## Potential breaking changes
## Migration notes

Now generate it.`;

write(path.join(dir, "PROMPT_RELEASE_NOTES.md"), prompt);

console.log("OK");
