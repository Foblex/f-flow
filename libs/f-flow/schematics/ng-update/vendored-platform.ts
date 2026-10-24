import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  getPackageJsonDependency,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

const PLATFORM_PACKAGE = '@foblex/platform';
const FLOW_PACKAGE = '@foblex/flow';

/**
 * `@foblex/platform` is vendored into `@foblex/flow`: its services are compiled into the
 * library and re-exported from the public API. This migration rewrites application
 * imports of the standalone package to `@foblex/flow` (so the application and the
 * library share one copy of every DI token) and removes the now-obsolete dependency.
 */
export function migrateVendoredPlatform(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rewrittenFiles = rewritePlatformImports(tree);

    rewrittenFiles.forEach((file) =>
      context.logger.info(
        `✅ Rewrote "${PLATFORM_PACKAGE}" imports to "${FLOW_PACKAGE}" in ${file}`,
      ),
    );

    if (getPackageJsonDependency(tree, PLATFORM_PACKAGE)) {
      removePackageJsonDependency(tree, PLATFORM_PACKAGE);
      context.addTask(new NodePackageInstallTask());
      context.logger.info(
        `✅ Removed "${PLATFORM_PACKAGE}" from package.json - it is bundled with "${FLOW_PACKAGE}" now.`,
      );
    }

    return tree;
  };
}

const IMPORT_PATTERN = /(from\s*['"])@foblex\/platform(['"])/gu;
const DYNAMIC_IMPORT_PATTERN = /(import\s*\(\s*['"])@foblex\/platform(['"]\s*\))/gu;
const SKIPPED_PATH_SEGMENTS = ['/node_modules/', '/dist/', '/.git/', '/.angular/'];

function rewritePlatformImports(tree: Tree): string[] {
  const rewritten: string[] = [];

  tree.visit((path) => {
    if (!path.endsWith('.ts') && !path.endsWith('.mts')) {
      return;
    }
    if (SKIPPED_PATH_SEGMENTS.some((segment) => path.includes(segment))) {
      return;
    }

    const content = tree.read(path)?.toString();
    if (!content || !content.includes(PLATFORM_PACKAGE)) {
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
