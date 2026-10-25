import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, resolve } from 'node:path';

const MODULE_PATH = fileURLToPath(import.meta.url);

if (process.argv[1] && resolve(process.argv[1]) === MODULE_PATH) {
  validateRepository(process.cwd());
}

export function validateRepository(root) {
  const manifests = {
    root: readPackage(join(root, 'package.json')),
    flow: readPackage(join(root, 'libs', 'f-flow', 'package.json')),
    dagre: readPackage(join(root, 'libs', 'f-layout', 'dagre', 'package.json')),
    elk: readPackage(join(root, 'libs', 'f-layout', 'elk', 'package.json')),
    callCenter: readPackage(join(root, 'apps', 'example-apps', 'call-center', 'package.json')),
    marketing: readPackage(
      join(root, 'apps', 'example-apps', 'marketing-automation', 'package.json'),
    ),
  };
  const issues = collectReleaseIssues(manifests);

  if (issues.length) {
    console.error('Release package validation failed:\n');
    for (const issue of issues) {
      console.error(`- ${issue}`);
    }
    process.exitCode = 1;

    return;
  }

  console.log(
    `Release package validation passed: ${manifests.flow.name}@${manifests.flow.version}, ` +
      `${manifests.dagre.name}@${manifests.dagre.version}, ` +
      `${manifests.elk.name}@${manifests.elk.version}.`,
  );
}

export function collectReleaseIssues({ root, flow, dagre, elk, callCenter, marketing }) {
  const issues = [];
  const releaseVersion = flow.version;

  for (const [name, manifest] of [
    ['package.json', root],
    ['libs/f-layout/dagre/package.json', dagre],
    ['libs/f-layout/elk/package.json', elk],
  ]) {
    if (manifest.version !== releaseVersion) {
      issues.push(`${name}: expected version ${releaseVersion}, found ${manifest.version}`);
    }
  }

  // the layout packages import flow's public API, so their peer floor must stay inside
  // the released major and must not point past the version being released — but it is
  // allowed to be higher than ^major.0.0 when the import surface appeared mid-major
  // (e.g. the vendored geometry exports exist only since 19.4.0)
  for (const [name, manifest] of [
    ['libs/f-layout/dagre/package.json', dagre],
    ['libs/f-layout/elk/package.json', elk],
  ]) {
    const actualPeer = manifest.peerDependencies?.['@foblex/flow'];
    const match = /^\^(\d+)\.(\d+)\.(\d+)$/.exec(actualPeer ?? '');
    const [relMajor, relMinor, relPatch] = releaseVersion.split('.').map(Number);
    if (!match) {
      issues.push(`${name}: expected a caret @foblex/flow peer, found ${actualPeer ?? 'missing'}`);
      continue;
    }
    const [peerMajor, peerMinor, peerPatch] = match.slice(1).map(Number);
    const floorBeyondRelease =
      peerMinor > relMinor || (peerMinor === relMinor && peerPatch > relPatch);
    if (peerMajor !== relMajor || floorBeyondRelease) {
      issues.push(
        `${name}: @foblex/flow peer ${actualPeer} must stay within ^${relMajor} and not exceed ${releaseVersion}`,
      );
    }
  }

  const exactDependencies = [
    [
      'apps/example-apps/call-center/package.json',
      callCenter.dependencies?.['@foblex/flow'],
      releaseVersion,
    ],
    [
      'apps/example-apps/marketing-automation/package.json (@foblex/flow)',
      marketing.dependencies?.['@foblex/flow'],
      releaseVersion,
    ],
    [
      'apps/example-apps/marketing-automation/package.json (@foblex/flow-dagre-layout)',
      marketing.dependencies?.['@foblex/flow-dagre-layout'],
      dagre.version,
    ],
  ];

  for (const [name, actual, expected] of exactDependencies) {
    if (actual !== expected) {
      issues.push(`${name}: expected ${expected}, found ${actual ?? 'missing'}`);
    }
  }

  return issues;
}

function readPackage(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}
