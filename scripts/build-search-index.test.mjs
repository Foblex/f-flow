import assert from 'node:assert/strict';
import test from 'node:test';
import { chunkPage } from './build-search-index.mjs';

test('removes a long fenced block before paragraph chunking', () => {
  const noisyCode = Array.from(
    { length: 120 },
    (_, index) => `const internalImplementation${index} = ${index};`,
  ).join('\n\n');
  const rawBody = `## Managed state

Choose the state boundary deliberately.

\`\`\`ts
${noisyCode}
\`\`\`

Snapshots remain application-controlled.
`;

  const chunks = chunkPage({
    title: 'Managed Flow State',
    description: 'Typed records and history',
    rawBody,
  });
  const indexedText = chunks.map((chunk) => `${chunk.excerpt} ${chunk.keywords}`).join(' ');

  assert.match(indexedText, /Choose the state boundary deliberately/u);
  assert.match(indexedText, /Snapshots remain application-controlled/u);
  assert.doesNotMatch(indexedText, /internalImplementation/u);
  assert.doesNotMatch(indexedText, /```/u);
});
