import assert from 'node:assert/strict';
import test from 'node:test';
import { collectReleaseIssues } from './validate-release-packages.mjs';

function createManifests() {
  return {
    root: { version: '19.1.6' },
    flow: { name: '@foblex/flow', version: '19.1.6' },
    dagre: {
      name: '@foblex/flow-dagre-layout',
      version: '19.1.6',
      peerDependencies: { '@foblex/flow': '^19.0.0' },
    },
    elk: {
      name: '@foblex/flow-elk-layout',
      version: '19.1.6',
      peerDependencies: { '@foblex/flow': '^19.0.0' },
    },
    callCenter: { dependencies: { '@foblex/flow': '19.1.6' } },
    marketing: {
      dependencies: {
        '@foblex/flow': '19.1.6',
        '@foblex/flow-dagre-layout': '19.1.6',
      },
    },
  };
}

test('accepts a synchronized release train with a current-major layout peer', () => {
  assert.deepEqual(collectReleaseIssues(createManifests()), []);
});

test('rejects the stale v18 layout peer that excluded Flow v19', () => {
  const manifests = createManifests();
  manifests.dagre.peerDependencies['@foblex/flow'] = '^18.4.0';

  assert.deepEqual(collectReleaseIssues(manifests), [
    'libs/f-layout/dagre/package.json: expected @foblex/flow peer ^19.0.0, found ^18.4.0',
  ]);
});

test('rejects drift between package and current example versions', () => {
  const manifests = createManifests();
  manifests.elk.version = '19.1.5';

  assert.deepEqual(collectReleaseIssues(manifests), [
    'libs/f-layout/elk/package.json: expected version 19.1.6, found 19.1.5',
  ]);
});
