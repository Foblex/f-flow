import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';

const root = path.resolve(
  process.cwd(),
  'libs/f-flow/src/domain/f-connection/redraw-connections',
);

const files = collectFiles(root).filter(
  (file) => file.endsWith('.ts') && !file.endsWith('.spec.ts'),
);
const fileSet = new Set(files);
const graph = new Map(files.map((file) => [file, resolveLocalImports(file)]));

const cycles = findCycles(graph);

if (cycles.length) {
  console.error('Detected import cycles in redraw-connections:');

  for (const cycle of cycles) {
    console.error(`- ${cycle.map((file) => path.relative(root, file)).join(' -> ')}`);
  }

  process.exit(1);
}

console.log('No import cycles detected in redraw-connections.');

function collectFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true });
  const result = [];

  for (const entry of entries) {
    const target = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      result.push(...collectFiles(target));
      continue;
    }

    result.push(target);
  }

  return result;
}

function resolveLocalImports(file) {
  const content = readFileSync(file, 'utf8');
  const imports = [];
  const pattern = /(?:import|export)\s+(?:type\s+)?(?:[^'"]*?\sfrom\s*)?['"]([^'"]+)['"]/g;

  for (const match of content.matchAll(pattern)) {
    const specifier = match[1];
    if (!specifier.startsWith('.')) {
      continue;
    }

    const resolved = resolveImport(file, specifier);
    if (!resolved || !fileSet.has(resolved)) {
      continue;
    }

    imports.push(resolved);
  }

  return imports;
}

function resolveImport(file, specifier) {
  const basePath = path.resolve(path.dirname(file), specifier);
  const candidates = [
    basePath,
    `${basePath}.ts`,
    `${basePath}.mts`,
    path.join(basePath, 'index.ts'),
    path.join(basePath, 'index.mts'),
  ];

  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

function findCycles(graph) {
  const visiting = new Set();
  const visited = new Set();
  const stack = [];
  const cycles = [];
  const seenCycles = new Set();

  for (const node of graph.keys()) {
    visit(node);
  }

  return cycles;

  function visit(node) {
    if (visited.has(node)) {
      return;
    }

    if (visiting.has(node)) {
      const startIndex = stack.indexOf(node);
      const cycle = [...stack.slice(startIndex), node];
      const key = cycle.join('::');
      if (!seenCycles.has(key)) {
        seenCycles.add(key);
        cycles.push(cycle);
      }

      return;
    }

    visiting.add(node);
    stack.push(node);

    for (const dependency of graph.get(node) ?? []) {
      visit(dependency);
    }

    stack.pop();
    visiting.delete(node);
    visited.add(node);
  }
}
