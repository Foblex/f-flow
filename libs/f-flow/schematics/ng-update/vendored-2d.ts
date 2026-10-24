import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  getPackageJsonDependency,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

const F2D_PACKAGE = '@foblex/2d';
const FLOW_PACKAGE = '@foblex/flow';

/**
 * `@foblex/2d` is vendored into `@foblex/flow` and re-exported from its public API.
 * The migration rewrites application imports of the standalone package to
 * `@foblex/flow` and removes the now-obsolete dependency. Unlike the other vendored
 * packages the geometry types (`IPoint`, `IRect`, …) are the library's public
 * vocabulary, so the re-exports are first-class API, not deprecated aliases.
 */
export function migrateVendored2d(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rewrittenFiles = rewrite2dImports(tree);

    rewrittenFiles.forEach((file) =>
      context.logger.info(`✅ Rewrote "${F2D_PACKAGE}" imports to "${FLOW_PACKAGE}" in ${file}`),
    );

    if (getPackageJsonDependency(tree, F2D_PACKAGE)) {
      removePackageJsonDependency(tree, F2D_PACKAGE);
      context.addTask(new NodePackageInstallTask());
      context.logger.info(
        `✅ Removed "${F2D_PACKAGE}" from package.json - it is bundled with "${FLOW_PACKAGE}" now.`,
      );
    }

    return tree;
  };
}

const IMPORT_PATTERN = /(from\s*['"])@foblex\/2d(['"])/gu;
const DYNAMIC_IMPORT_PATTERN = /(import\s*\(\s*['"])@foblex\/2d(['"]\s*\))/gu;
const SKIPPED_PATH_SEGMENTS = ['/node_modules/', '/dist/', '/.git/', '/.angular/'];

function rewrite2dImports(tree: Tree): string[] {
  const rewritten: string[] = [];

  tree.visit((path) => {
    if (!path.endsWith('.ts') && !path.endsWith('.mts')) {
      return;
    }
    if (SKIPPED_PATH_SEGMENTS.some((segment) => path.includes(segment))) {
      return;
    }

    const content = tree.read(path)?.toString();
    if (!content || !content.includes(F2D_PACKAGE)) {
      return;
    }

    const updated = content
      .replace(IMPORT_PATTERN, `$1${FLOW_PACKAGE}$2`)
      .replace(DYNAMIC_IMPORT_PATTERN, `$1${FLOW_PACKAGE}$2`);

    if (updated !== content) {
      tree.overwrite(path, updated);
      rewritten.push(path);
    }
  });

  return rewritten;
}
