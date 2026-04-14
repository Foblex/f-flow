import { json } from '@angular-devkit/core';
import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { updateWorkspace } from '@schematics/angular/utility';
import {
  addPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { FoblexFlowDependencies } from '../shared/foblex-flow-dependencies';
import { INgAddSchema } from '../shared/i-ng-add-schema';
import { hasPackageJsonDependency } from '../shared/package-json';

const DEFAULT_THEME_STYLE_PATH = 'node_modules/@foblex/flow/styles/default.scss';
const KNOWN_THEME_STYLE_PATHS = new Set([
  DEFAULT_THEME_STYLE_PATH,
  '@foblex/flow/styles/default.scss',
]);

export function ngAdd(options: INgAddSchema): Rule {
  const installationState = { hasNewDependencies: false };

  return chain([
    addDependencies(installationState),
    addDefaultTheme(options),
    installDependencies(installationState),
  ]);
}

function addDependencies(installationState: { hasNewDependencies: boolean }): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('Installing dependencies for @foblex/flow-dagre-layout...');

    FoblexFlowDependencies.forEach((dependency) => {
      if (hasPackageJsonDependency(tree, dependency.name)) {
        context.logger.info(
          `Skipped "${dependency.name}" because it is already present in package.json`,
        );

        return;
      }

      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Default,
        name: dependency.name,
        version: dependency.version,
      });

      installationState.hasNewDependencies = true;
      context.logger.info(`Added "${dependency.name}" to package.json`);
    });

    return tree;
  };
}

function addDefaultTheme(options: INgAddSchema): Rule {
  if (options.skipTheme) {
    return (_tree: Tree, context: SchematicContext) => {
      context.logger.info('Skipped adding the default @foblex/flow theme.');

      return _tree;
    };
  }

  return updateWorkspace((workspace) => {
    for (const [, project] of workspace.projects) {
      if (project.extensions['projectType'] !== 'application') {
        continue;
      }

      addStyleToTarget(project.targets.get('build'));
      addStyleToTarget(project.targets.get('test'));
    }
  });
}

function addStyleToTarget(target?: {
  options?: Record<string, json.JsonValue | undefined>;
  configurations?: Record<string, Record<string, json.JsonValue | undefined> | undefined>;
}): void {
  if (!target) {
    return;
  }

  ensureThemeInStyles((target.options ??= {}));

  if (!target.configurations) {
    return;
  }

  Object.values(target.configurations).forEach((configuration) => {
    if (!configuration) {
      return;
    }

    ensureThemeInStyles(configuration);
  });
}

function ensureThemeInStyles(options: Record<string, json.JsonValue | undefined>): void {
  const styles = Array.isArray(options['styles']) ? [...options['styles']] : [];

  if (styles.some(isThemeStyleEntry)) {
    return;
  }

  styles.push(DEFAULT_THEME_STYLE_PATH);
  options['styles'] = styles;
}

function isThemeStyleEntry(entry: json.JsonValue | undefined): boolean {
  if (typeof entry === 'string') {
    return KNOWN_THEME_STYLE_PATHS.has(entry);
  }

  if (!entry || typeof entry !== 'object' || Array.isArray(entry)) {
    return false;
  }

  const input = (entry as Record<string, unknown>)['input'];

  return typeof input === 'string' && KNOWN_THEME_STYLE_PATHS.has(input);
}

function installDependencies(installationState: { hasNewDependencies: boolean }): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    if (installationState.hasNewDependencies) {
      context.addTask(new NodePackageInstallTask());
      context.logger.info('Installed missing Foblex Flow dependencies.');
    } else {
      context.logger.info(
        'Skipped dependency installation because all required Foblex Flow packages are already present.',
      );
    }

    context.logger.info('Dagre support is ready.');
    context.logger.info(
      'Next step: provide DagreLayoutEngine and call calculate(...) in your flow component.',
    );

    return _tree;
  };
}
