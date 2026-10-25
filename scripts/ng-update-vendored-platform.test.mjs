import assert from 'node:assert/strict';
import { resolve } from 'node:path';
import { describe, test } from 'node:test';
import { HostTree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing/index.js';

const MIGRATIONS_PATH = resolve('dist/f-flow/schematics/migrations.json');

const PACKAGE_JSON = JSON.stringify(
  {
    dependencies: {
      '@foblex/flow': '^19.3.0',
      '@foblex/platform': '^1.0.4',
      '@foblex/2d': '^1.2.2',
    },
  },
  null,
  2,
);

function createTree(files) {
  const tree = new HostTree();
  Object.entries(files).forEach(([path, content]) => tree.create(path, content));

  return tree;
}

async function runMigration(tree) {
  const runner = new SchematicTestRunner('migrations', MIGRATIONS_PATH);

  return runner.runSchematic('migration-vendored-platform', {}, tree);
}

describe('@foblex/flow ng-update vendored-platform migration', () => {
  test('rewrites platform imports to @foblex/flow and removes the dependency', async () => {
    const tree = createTree({
      '/package.json': PACKAGE_JSON,
      '/src/app/flow.component.ts': [
        "import { BrowserService } from '@foblex/platform';",
        'import { Component } from "@angular/core";',
        "const lazy = () => import('@foblex/platform');",
        '',
      ].join('\n'),
    });

    const result = await runMigration(tree);
    const component = result.readContent('/src/app/flow.component.ts');
    const packageJson = JSON.parse(result.readContent('/package.json'));

    assert.match(component, /from '@foblex\/flow';/u);
    assert.match(component, /import\('@foblex\/flow'\)/u);
    assert.doesNotMatch(component, /@foblex\/platform/u);
    assert.equal(packageJson.dependencies['@foblex/platform'], undefined);
    assert.equal(packageJson.dependencies['@foblex/2d'], '^1.2.2');
    assert.equal(packageJson.dependencies['@foblex/flow'], '^19.3.0');
  });

  test('leaves projects without the dependency or imports untouched', async () => {
    const cleanPackageJson = JSON.stringify(
      { dependencies: { '@foblex/flow': '^19.3.0' } },
      null,
      2,
    );
    const source = "import { FFlowModule } from '@foblex/flow';\n";
    const tree = createTree({
      '/package.json': cleanPackageJson,
      '/src/main.ts': source,
    });

    const result = await runMigration(tree);

    assert.equal(result.readContent('/src/main.ts'), source);
    assert.equal(result.readContent('/package.json'), cleanPackageJson);
  });

  test('does not touch files under node_modules or dist', async () => {
    const vendored = "import { BrowserService } from '@foblex/platform';\n";
    const tree = createTree({
      '/package.json': PACKAGE_JSON,
      '/node_modules/some-lib/index.ts': vendored,
      '/dist/app/main.ts': vendored,
    });

    const result = await runMigration(tree);

    assert.equal(result.readContent('/node_modules/some-lib/index.ts'), vendored);
    assert.equal(result.readContent('/dist/app/main.ts'), vendored);
  });
});

describe('@foblex/flow ng-update vendored-mediator migration', () => {
  async function runMediatorMigration(tree) {
    const runner = new SchematicTestRunner('migrations', MIGRATIONS_PATH);

    return runner.runSchematic('migration-vendored-mediator', {}, tree);
  }

  const MEDIATOR_PACKAGE_JSON = JSON.stringify(
    { dependencies: { '@foblex/flow': '^19.3.0', '@foblex/mediator': '^1.1.3' } },
    null,
    2,
  );

  test('removes the dependency when the application does not import it', async () => {
    const tree = createTree({
      '/package.json': MEDIATOR_PACKAGE_JSON,
      '/src/main.ts': "import { FFlowModule } from '@foblex/flow';\n",
    });

    const result = await runMediatorMigration(tree);
    const packageJson = JSON.parse(result.readContent('/package.json'));

    assert.equal(packageJson.dependencies['@foblex/mediator'], undefined);
    assert.equal(packageJson.dependencies['@foblex/flow'], '^19.3.0');
  });

  test('rewrites mediator imports to @foblex/flow and removes the dependency', async () => {
    const tree = createTree({
      '/package.json': MEDIATOR_PACKAGE_JSON,
      '/src/custom.ts': "import { FMediator, IExecution } from '@foblex/mediator';\n",
    });

    const result = await runMediatorMigration(tree);
    const custom = result.readContent('/src/custom.ts');
    const packageJson = JSON.parse(result.readContent('/package.json'));

    assert.match(custom, /from '@foblex\/flow';/u);
    assert.doesNotMatch(custom, /@foblex\/mediator/u);
    assert.equal(packageJson.dependencies['@foblex/mediator'], undefined);
  });
});

describe('@foblex/flow ng-update vendored-utils migration', () => {
  async function runUtilsMigration(tree) {
    const runner = new SchematicTestRunner('migrations', MIGRATIONS_PATH);

    return runner.runSchematic('migration-vendored-utils', {}, tree);
  }

  const UTILS_PACKAGE_JSON = JSON.stringify(
    { dependencies: { '@foblex/flow': '^19.3.0', '@foblex/utils': '^1.1.1' } },
    null,
    2,
  );

  test('removes the dependency when the application does not import it', async () => {
    const tree = createTree({
      '/package.json': UTILS_PACKAGE_JSON,
      '/src/main.ts': "import { FFlowModule } from '@foblex/flow';\n",
    });

    const result = await runUtilsMigration(tree);
    const packageJson = JSON.parse(result.readContent('/package.json'));

    assert.equal(packageJson.dependencies['@foblex/utils'], undefined);
    assert.equal(packageJson.dependencies['@foblex/flow'], '^19.3.0');
  });

  test('rewrites utils imports to @foblex/flow and removes the dependency', async () => {
    const tree = createTree({
      '/package.json': UTILS_PACKAGE_JSON,
      '/src/custom.ts': "import { generateGuid, castToEnum } from '@foblex/utils';\n",
    });

    const result = await runUtilsMigration(tree);
    const custom = result.readContent('/src/custom.ts');
    const packageJson = JSON.parse(result.readContent('/package.json'));

    assert.match(custom, /from '@foblex\/flow';/u);
    assert.doesNotMatch(custom, /@foblex\/utils/u);
    assert.equal(packageJson.dependencies['@foblex/utils'], undefined);
  });
});

describe('@foblex/flow ng-update vendored-2d migration', () => {
  async function run2dMigration(tree) {
    const runner = new SchematicTestRunner('migrations', MIGRATIONS_PATH);

    return runner.runSchematic('migration-vendored-2d', {}, tree);
  }

  const F2D_PACKAGE_JSON = JSON.stringify(
    { dependencies: { '@foblex/flow': '^19.3.0', '@foblex/2d': '^1.2.2' } },
    null,
    2,
  );

  test('removes the dependency when the application does not import it', async () => {
    const tree = createTree({
      '/package.json': F2D_PACKAGE_JSON,
      '/src/main.ts': "import { FFlowModule } from '@foblex/flow';\n",
    });

    const result = await run2dMigration(tree);
    const packageJson = JSON.parse(result.readContent('/package.json'));

    assert.equal(packageJson.dependencies['@foblex/2d'], undefined);
    assert.equal(packageJson.dependencies['@foblex/flow'], '^19.3.0');
  });

  test('rewrites 2d imports to @foblex/flow and removes the dependency', async () => {
    const tree = createTree({
      '/package.json': F2D_PACKAGE_JSON,
      '/src/custom.ts': "import { IPoint, PointExtensions } from '@foblex/2d';\n",
    });

    const result = await run2dMigration(tree);
    const custom = result.readContent('/src/custom.ts');
    const packageJson = JSON.parse(result.readContent('/package.json'));

    assert.match(custom, /from '@foblex\/flow';/u);
    assert.doesNotMatch(custom, /@foblex\/2d/u);
    assert.equal(packageJson.dependencies['@foblex/2d'], undefined);
  });
});
