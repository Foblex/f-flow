import assert from 'node:assert/strict';
import test from 'node:test';
import {
  findHardcodedWeeklyMetricIssues,
  findStaleCurrentMajorIssues,
  validateCanonicalQuickstart,
} from './validate-llms-content.mjs';

const MODERN_QUICKSTART = `## Minimal Example

\`\`\`html
<f-connection fSourceId="source" fTargetId="target" />
<div fConnector fConnectorId="source" fConnectorType="source"></div>
<div fConnector fConnectorId="target" fConnectorType="target"></div>
\`\`\`

## Reference
`;

test('rejects a stale major described as current', () => {
  assert.deepEqual(findStaleCurrentMajorIssues('guide.md', 'Use the current `18.x` line.', 19), [
    'guide.md: "current `18.x`" names a stale current major (expected current 19.x)',
  ]);
  assert.deepEqual(findStaleCurrentMajorIssues('guide.md', 'Use the current `19.x` line.', 19), []);
});

test('rejects deprecated connector aliases inside a canonical quickstart', () => {
  const source = MODERN_QUICKSTART.replace(
    '<f-connection fSourceId="source" fTargetId="target" />',
    '<f-connection fOutputId="source" fInputId="target" />',
  );
  const issues = validateCanonicalQuickstart('guide.md', source, '## Minimal Example');

  assert.ok(issues.includes('guide.md: canonical quickstart must use "fSourceId"'));
  assert.ok(issues.includes('guide.md: canonical quickstart must use "fTargetId"'));
  assert.ok(issues.includes('guide.md: canonical quickstart uses deprecated "fOutputId"'));
  assert.ok(issues.includes('guide.md: canonical quickstart uses deprecated "fInputId"'));
});

test('allows deprecated aliases in an explicit reference section outside the quickstart', () => {
  const source = `${MODERN_QUICKSTART}
## Legacy API reference

fNodeOutput, fNodeInput, fOutputId, and fInputId remain documented for migration.
`;

  assert.deepEqual(validateCanonicalQuickstart('guide.md', source, '## Minimal Example'), []);
});

test('does not treat fConnectorId as the fConnector directive', () => {
  const source = MODERN_QUICKSTART.replaceAll('fConnector fConnectorId', 'fConnectorId');

  assert.ok(
    validateCanonicalQuickstart('guide.md', source, '## Minimal Example').includes(
      'guide.md: canonical quickstart must use "fConnector"',
    ),
  );
});

test('rejects a hardcoded weekly install snapshot', () => {
  assert.equal(findHardcodedWeeklyMetricIssues('llms.txt', 'Weekly installs: ~16K').length, 1);
  assert.deepEqual(
    findHardcodedWeeklyMetricIssues(
      'llms.txt',
      'Current download data: https://www.npmjs.com/package/@foblex/flow',
    ),
    [],
  );
});
