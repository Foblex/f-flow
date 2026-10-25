import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  getPackageJsonDependency,
  removePackageJsonDependency,
} from '@schematics/angular/utility/dependencies';

const UTILS_PACKAGE = '@foblex/utils';
const FLOW_PACKAGE = '@foblex/flow';

/**
 * `@foblex/utils` is vendored into `@foblex/flow` and re-exported from its public API.
 * The migration rewrites application imports of the standalone package to
 * `@foblex/flow` and removes the now-obsolete dependency. The re-exports are
 * deprecated: applications that keep using the helpers should depend on
 * `@foblex/utils` directly (the package stays published on npm).
 */
export function migrateVendoredUtils(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const rewrittenFiles = rewriteUtilsImports(tree);

    rewrittenFiles.forEach((file) =>
      context.logger.info(`✅ Rewrote "${UTILS_PACKAGE}" imports to "${FLOW_PACKAGE}" in ${file}`),
    );

    if (getPackageJsonDependency(tree, UTILS_PACKAGE)) {
      removePackageJsonDependency(tree, UTILS_PACKAGE);
      context.addTask(new NodePackageInstallTask());
      context.logger.info(
        `✅ Removed "${UTILS_PACKAGE}" from package.json - it is bundled with "${FLOW_PACKAGE}" now.`,
      );
    }

    return tree;
  };
}

const IMPORT_PATTERN = /(from\s*['"])@foblex\/utils(['"])/gu;
const DYNAMIC_IMPORT_PATTERN = /(import\s*\(\s*['"])@foblex\/utils(['"]\s*\))/gu;
const SKIPPED_PATH_SEGMENTS = ['/node_modules/', '/dist/', '/.git/', '/.angular/'];

function rewriteUtilsImports(tree: Tree): string[] {
  const rewritten: string[] = [];

  tree.visit((path) => {
    if (!path.endsWith('.ts') && !path.endsWith('.mts')) {
      return;
    }
    if (SKIPPED_PATH_SEGMENTS.some((segment) => path.includes(segment))) {
      return;
    }

    const content = tree.read(path)?.toString();
    if (!content || !content.includes(UTILS_PACKAGE)) {
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
