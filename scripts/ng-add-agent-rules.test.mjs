import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { describe, test } from 'node:test';
import { HostTree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing/index.js';

const COLLECTION_PATH = resolve('dist/f-flow/schematics/collection.json');
const AGENT_RULES_BEGIN = '<!-- BEGIN:foblex-flow-agent-rules -->';
const AGENT_RULES_END = '<!-- END:foblex-flow-agent-rules -->';

describe('@foblex/flow ng-add agent instructions', () => {
  test('creates canonical AGENTS.md rules and imports them from CLAUDE.md', async () => {
    const result = await runNgAdd();

    assert.match(result.readContent('/AGENTS.md'), /node_modules\/@foblex\/flow\/AI\.md/u);
    assert.equal(result.readContent('/CLAUDE.md'), '@AGENTS.md\n');
  });

  test('preserves existing content and remains idempotent', async () => {
    const existingAgents = '# Workspace agent rules\n\nKeep this rule.\n';
    const existingClaude = '# Claude-specific instructions\n\nKeep this instruction.\n';
    const initialTree = createWorkspaceTree({
      '/AGENTS.md': existingAgents,
      '/CLAUDE.md': existingClaude,
    });

    const firstRun = await runNgAdd({}, initialTree);
    const firstAgents = firstRun.readContent('/AGENTS.md');
    const firstClaude = firstRun.readContent('/CLAUDE.md');
    const secondRun = await runNgAdd({}, firstRun);

    assert.ok(firstAgents.startsWith(existingAgents));
    assert.equal(countOccurrences(firstAgents, AGENT_RULES_BEGIN), 1);
    assert.equal(countOccurrences(firstAgents, AGENT_RULES_END), 1);
    assert.equal(firstClaude, `${existingClaude}\n@AGENTS.md\n`);
    assert.equal(secondRun.readContent('/AGENTS.md'), firstAgents);
    assert.equal(secondRun.readContent('/CLAUDE.md'), firstClaude);
  });

  test('does not duplicate an existing Claude Code import', async () => {
    const existingClaude = '# Claude instructions\n\n@AGENTS.md\n\nKeep this instruction.\n';
    const initialTree = createWorkspaceTree({ '/CLAUDE.md': existingClaude });

    const result = await runNgAdd({}, initialTree);

    assert.equal(result.readContent('/CLAUDE.md'), existingClaude);
    assert.equal(countOccurrences(result.readContent('/CLAUDE.md'), '@AGENTS.md'), 1);
  });

  test('recognizes Claude Code imports in prose and with CRLF line endings', async () => {
    const proseImport = '# Claude instructions\n\nRead @./AGENTS.md before editing.\n';
    const crlfImport = '# Claude instructions\r\n\r\n@AGENTS.md\r\n';

    const proseResult = await runNgAdd({}, createWorkspaceTree({ '/CLAUDE.md': proseImport }));
    const crlfResult = await runNgAdd({}, createWorkspaceTree({ '/CLAUDE.md': crlfImport }));

    assert.equal(proseResult.readContent('/CLAUDE.md'), proseImport);
    assert.equal(crlfResult.readContent('/CLAUDE.md'), crlfImport);
  });

  test('does not treat code examples as active Claude Code imports', async () => {
    const existingClaude =
      '# Claude instructions\n\n```md\n@AGENTS.md\n```\n\nExample: `@./AGENTS.md`\n';
    const initialTree = createWorkspaceTree({ '/CLAUDE.md': existingClaude });

    const result = await runNgAdd({}, initialTree);

    assert.equal(result.readContent('/CLAUDE.md'), `${existingClaude}\n@AGENTS.md\n`);
  });

  test('leaves malformed managed markers untouched across repeated runs', async () => {
    const existingAgents = `${AGENT_RULES_BEGIN}\nKeep this user-authored rule.\n`;
    const initialTree = createWorkspaceTree({ '/AGENTS.md': existingAgents });

    const firstRun = await runNgAdd({}, initialTree);
    const secondRun = await runNgAdd({}, firstRun);

    assert.equal(firstRun.readContent('/AGENTS.md'), existingAgents);
    assert.equal(secondRun.readContent('/AGENTS.md'), existingAgents);
  });

  test('does not treat marker examples in code fences as the managed block', async () => {
    const existingAgents = `# Marker documentation\n\n\`\`\`md\n${AGENT_RULES_BEGIN}\nExample content.\n${AGENT_RULES_END}\n\`\`\`\n`;
    const initialTree = createWorkspaceTree({ '/AGENTS.md': existingAgents });

    const firstRun = await runNgAdd({}, initialTree);
    const firstAgents = firstRun.readContent('/AGENTS.md');
    const secondRun = await runNgAdd({}, firstRun);

    assert.ok(firstAgents.startsWith(existingAgents));
    assert.match(firstAgents, /node_modules\/@foblex\/flow\/AI\.md/u);
    assert.equal(secondRun.readContent('/AGENTS.md'), firstAgents);
  });

  test('preserves CRLF line endings when adding the managed block', async () => {
    const existingAgents = '# Workspace rules\r\n\r\nKeep this rule.\r\n';
    const initialTree = createWorkspaceTree({ '/AGENTS.md': existingAgents });

    const result = await runNgAdd({}, initialTree);
    const updatedAgents = result.readContent('/AGENTS.md');

    assert.ok(updatedAgents.startsWith(existingAgents));
    assert.doesNotMatch(updatedAgents, /(?<!\r)\n/u);
  });

  test('skipAgentRules leaves both instruction files untouched', async () => {
    const existingAgents = '# Existing AGENTS.md\n';
    const existingClaude = '# Existing CLAUDE.md\n';
    const initialTree = createWorkspaceTree({
      '/AGENTS.md': existingAgents,
      '/CLAUDE.md': existingClaude,
    });

    const result = await runNgAdd({ skipAgentRules: true }, initialTree);

    assert.equal(result.readContent('/AGENTS.md'), existingAgents);
    assert.equal(result.readContent('/CLAUDE.md'), existingClaude);
  });
});

async function runNgAdd(options = {}, tree = createWorkspaceTree()) {
  const runner = new SchematicTestRunner('foblex-flow', COLLECTION_PATH);

  return runner.runSchematic('ng-add', options, tree);
}

function createWorkspaceTree(files = {}) {
  const tree = new HostTree();

  tree.create('/package.json', JSON.stringify({ dependencies: {} }));
  tree.create('/angular.json', JSON.stringify({ version: 1, projects: {} }));

  for (const [path, content] of Object.entries(files)) {
    tree.create(path, content);
  }

  return tree;
}

function countOccurrences(content, fragment) {
  return content.split(fragment).length - 1;
}
