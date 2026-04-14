#!/usr/bin/env node
/**
 * One-shot npm-package verification for @foblex/flow.
 *
 *   1. Build + npm-pack the library (nx run f-flow:pack).
 *   2. Swap tsconfig.base.json so the portal resolves @foblex/flow
 *      from node_modules instead of the workspace sources.
 *   3. Install the freshly built tarball with --no-save (no mutation
 *      of package.json / package-lock.json).
 *   4. Run the portal e2e suite (it spins up portal:serve itself).
 *   5. Restore tsconfig.base.json and clean the tarball out of
 *      node_modules — always, even on failure or Ctrl+C.
 */
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const WORKSPACE = resolve('.');
const TSCONFIG = join(WORKSPACE, 'tsconfig.base.json');
const TARBALL_DIR = join(WORKSPACE, 'dist/f-flow');
const BACKUP_DIR = join(WORKSPACE, 'tmp/verify-npm');
const TSCONFIG_BACKUP = join(BACKUP_DIR, 'tsconfig.base.json.bak');
const LOCK_FILE = join(BACKUP_DIR, 'verify-npm.lock');
const INSTALLED_PATH = join(WORKSPACE, 'node_modules/@foblex/flow');
const NODE_MODULES = join(WORKSPACE, 'node_modules');
const NODE_MODULES_BIN = join(NODE_MODULES, '.bin');
const PACKAGE_ALIAS = '@foblex/flow';
const NPM_RETIRE_PATTERN = /^\.(.+)-[A-Za-z0-9]{8}$/;

let cleanupDone = false;
let lockAcquired = false;

function log(message) {
  console.log(`[verify-npm] ${message}`);
}

function run(command, args) {
  log(`$ ${command} ${args.join(' ')}`);
  const result = spawnSync(command, args, { stdio: 'inherit', shell: false });
  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`"${command} ${args.join(' ')}" exited with code ${result.status}`);
  }
}

function findLatestTarball() {
  if (!existsSync(TARBALL_DIR)) {
    throw new Error(`Directory "${TARBALL_DIR}" does not exist. Did "nx run f-flow:pack" succeed?`);
  }
  const tarballs = readdirSync(TARBALL_DIR)
    .filter((name) => name.endsWith('.tgz'))
    .map((name) => {
      const full = join(TARBALL_DIR, name);
      return { path: full, mtimeMs: statSync(full).mtimeMs };
    })
    .sort((a, b) => b.mtimeMs - a.mtimeMs);

  if (tarballs.length === 0) {
    throw new Error(`No .tgz file found in "${TARBALL_DIR}".`);
  }
  return tarballs[0].path;
}

function backupTsconfig() {
  mkdirSync(BACKUP_DIR, { recursive: true });
  copyFileSync(TSCONFIG, TSCONFIG_BACKUP);
  log(`Backed up tsconfig.base.json → ${TSCONFIG_BACKUP}`);
}

function acquireLock() {
  mkdirSync(BACKUP_DIR, { recursive: true });

  try {
    writeFileSync(LOCK_FILE, `${process.pid}\n`, { flag: 'wx' });
    lockAcquired = true;
  } catch (error) {
    if (error?.code === 'EEXIST') {
      throw new Error(`Another verify-npm run is already active. Remove "${LOCK_FILE}" if the previous run crashed.`);
    }
    throw error;
  }
}

function mutateTsconfig() {
  const original = readFileSync(TSCONFIG, 'utf8');
  const parsed = JSON.parse(original);
  if (parsed.compilerOptions?.paths?.[PACKAGE_ALIAS]) {
    delete parsed.compilerOptions.paths[PACKAGE_ALIAS];
    writeFileSync(TSCONFIG, JSON.stringify(parsed, null, 2) + '\n', 'utf8');
    log(`Removed "${PACKAGE_ALIAS}" alias from tsconfig.base.json`);
  } else {
    log(`No "${PACKAGE_ALIAS}" alias in tsconfig.base.json — nothing to remove`);
  }
}

function restore() {
  if (cleanupDone) return;
  cleanupDone = true;

  if (existsSync(TSCONFIG_BACKUP)) {
    copyFileSync(TSCONFIG_BACKUP, TSCONFIG);
    rmSync(TSCONFIG_BACKUP, { force: true });
    log('Restored tsconfig.base.json');
  }

  if (existsSync(INSTALLED_PATH)) {
    rmSync(INSTALLED_PATH, { recursive: true, force: true });
    log(`Removed ${INSTALLED_PATH}`);
  }

  cleanupNpmRetireArtifacts();

  if (lockAcquired && existsSync(LOCK_FILE)) {
    rmSync(LOCK_FILE, { force: true });
  }
}

function registerCleanup() {
  process.on('exit', restore);
  for (const signal of ['SIGINT', 'SIGTERM', 'SIGHUP']) {
    process.on(signal, () => {
      restore();
      process.exit(1);
    });
  }
  process.on('uncaughtException', (error) => {
    console.error(`[verify-npm] Uncaught exception: ${error.message}`);
    restore();
    process.exit(1);
  });
  process.on('unhandledRejection', (reason) => {
    const message = reason instanceof Error ? reason.message : String(reason);
    console.error(`[verify-npm] Unhandled rejection: ${message}`);
    restore();
    process.exit(1);
  });
}

function main() {
  registerCleanup();
  acquireLock();

  log('Step 1/4 — Building and packing @foblex/flow');
  run('npx', ['nx', 'run', 'f-flow:pack']);

  const tarball = findLatestTarball();
  log(`Step 2/4 — Tarball: ${tarball}`);

  backupTsconfig();
  mutateTsconfig();
  cleanupNpmRetireArtifacts();

  log('Step 3/4 — Installing tarball into node_modules (--no-save)');
  run('npm', ['install', '--no-save', tarball]);

  log('Step 4/4 — Running portal e2e against the packaged build');
  run('npx', ['nx', 'run', 'portal-e2e:e2e']);

  log('Verification succeeded ✔');
}

function cleanupNpmRetireArtifacts() {
  cleanupNpmRetireArtifactsInDirectory(NODE_MODULES);
  cleanupNpmRetireArtifactsInDirectory(NODE_MODULES_BIN);
}

function cleanupNpmRetireArtifactsInDirectory(directoryPath) {
  if (!existsSync(directoryPath)) return;

  for (const entryName of readdirSync(directoryPath)) {
    const match = entryName.match(NPM_RETIRE_PATTERN);
    if (!match) continue;

    const currentPath = join(directoryPath, entryName);
    const originalPath = join(directoryPath, match[1]);

    if (!existsSync(originalPath)) continue;

    rmSync(currentPath, { recursive: true, force: true });
    log(`Removed stale npm retire artifact: ${currentPath}`);
  }
}

try {
  main();
} catch (error) {
  console.error(`[verify-npm] ${error.message}`);
  process.exitCode = 1;
} finally {
  restore();
}
