const sectionTitleByType = {
  feat: 'Features',
  fix: 'Bug Fixes',
  docs: 'Documentation',
  test: 'Tests',
  ci: 'Continuous Integration',
  // chore/refactor/build stay hidden via "types" in package.json (you already did that)
};

// Pretty names for well-known scopes -> shown as bold subsection labels
const prettyScope = (scope) => {
  if (!scope) return null;
  const map = {
    connection: 'Connection Rendering Improvements',
    connections: 'Connection Rendering Improvements',
    canvas: 'Canvas & Zoom',
    zoom: 'Canvas & Zoom',
    examples: 'Examples',
    docs: 'Documentation',
  };
  return map[scope.toLowerCase()] || null;
};

// group commits with the same subject (or very similar) to avoid duplicates
function dedupeCommitGroups(commitGroups) {
  for (const group of commitGroups) {
    const seen = new Map(); // subject -> commit
    const next = [];
    for (const c of group.commits) {
      const key = (c.subject || '').trim().toLowerCase();
      if (!key) {
        next.push(c);
        continue;
      }
      if (!seen.has(key)) {
        seen.set(key, c);
        next.push(c);
      } else {
        // merge hashes into the first occurrence (so you can show multiple short hashes if desired)
        const first = seen.get(key);
        first._extraHashes = first._extraHashes || [];
        first._extraHashes.push(c.shortHash);
      }
    }
    group.commits = next;
  }
  return commitGroups;
}

module.exports = {
  header:
    '# Changelog\n\nAll notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.\n',
  types: [
    // Order here defines section order
    { type: 'feat', section: sectionTitleByType.feat },
    { type: 'fix', section: sectionTitleByType.fix },
    { type: 'docs', section: sectionTitleByType.docs },
    { type: 'test', section: sectionTitleByType.test },
    { type: 'ci', section: sectionTitleByType.ci, hidden: true },
    { type: 'chore', hidden: true },
    { type: 'style', hidden: true },
    { type: 'refactor', hidden: true },
    { type: 'build', hidden: true },
    { type: 'revert', hidden: true },
  ],
  commitUrlFormat: '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}',
  compareUrlFormat: '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}',
  issueUrlFormat: '{{host}}/{{owner}}/{{repository}}/issues/{{id}}',

  // Fine-grained control over how commits are transformed & printed
  writerOpts: {
    groupBy: 'type',
    // Ensure groups/commits are sorted predictably
    commitGroupsSort: (a, b) => {
      const order = ['Features', 'Bug Fixes', 'Documentation', 'Tests', 'Continuous Integration'];
      return order.indexOf(a.title) - order.indexOf(b.title);
    },
    commitsSort: ['scope', 'subject'],

    // Transform each commit: normalize titles, enrich scope, strip noise
    transform: (commit, context) => {
      if (!commit || !commit.type) return;

      // map conventional commit type -> section title
      const mapped = sectionTitleByType[commit.type];
      if (!mapped) return; // hidden types are dropped

      // Standardize commit header elements
      commit.type = mapped;

      // Normalize subject spacing
      if (commit.subject) commit.subject = commit.subject.replace(/\s+/g, ' ').trim();

      // Pretty scope (optional bold label in output)
      commit._prettyScope = prettyScope(commit.scope);

      // Render a short commit URL
      if (context.repository && context.commit && commit.hash) {
        commit.shortHash = commit.hash.substring(0, 7);
      }

      return commit;
    },

    // After the parser groups commits, we can adjust groups, dedupe, etc.
    finalizeContext: (context) => {
      if (Array.isArray(context.commitGroups)) {
        // Deduplicate identical subjects inside each group
        context.commitGroups = dedupeCommitGroups(context.commitGroups);

        // Optionally: bubble "Documentation" to the end if present (already covered by commitGroupsSort)
      }
      return context;
    },

    // Main section template (matches your style)
    mainTemplate: `{{> header}}

{{#each releases}}
### [{{version}}]({{compareUrl}}) ({{datetime date}})

{{#each commitGroups}}
### {{title}}

{{#if commits}}
{{#each commits}}
- {{#if this._prettyScope}}**{{this._prettyScope}}** — {{/if}}{{subject}} ({{#if @root.commitUrlFormat}}[{{shortHash}}]({{commitUrl}}){{else}}{{shortHash}}{{/if}}{{#if this._extraHashes}}; also {{#each this._extraHashes}}[{{this}}]({{../commitUrl}}){{#unless @last}}, {{/unless}}{{/each}}{{/if}})
{{/each}}
{{/if}}

{{/each}}
{{/each}}
`,

    // Header partial — keep the top “Changelog” header as-is
    headerPartial: '{{#if isPatch}}##{{/if}}',

    // Commit partial — unused because we fully control the bullet above
    commitPartial: '',
  },

  // Use the default parserOpts (Conventional Commits). You can tweak if needed:
  parserOpts: {
    noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
  },
};
