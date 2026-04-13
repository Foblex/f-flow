import { json } from '@angular-devkit/core';
import { chain, Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import { updateWorkspace } from '@schematics/angular/utility';
import {
  addPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { FoblexDependencies } from '../shared/foblex-dependencies';

const DEFAULT_THEME_STYLE_PATH = 'node_modules/@foblex/flow/styles/default.scss';
const KNOWN_THEME_STYLE_PATHS = new Set([
  DEFAULT_THEME_STYLE_PATH,
  '@foblex/flow/styles/default.scss',
]);

export function ngAdd(): Rule {
  return chain([addDependencies(), addDefaultTheme(), installDependencies()]);
}

function addDependencies(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('⚡ Installing @foblex/flow dependencies...');

    FoblexDependencies.forEach((dependency) => {
      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Default,
        name: dependency.name,
        version: dependency.version,
      });
      context.logger.info(`✅ Added "${dependency.name}" to package.json`);
    });

    return tree;
  };
}

function addDefaultTheme(): Rule {
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

function installDependencies(): Rule {
  return (_tree: Tree, context: SchematicContext) => {
    context.addTask(new NodePackageInstallTask());
    context.logger.info(`✅ Added "${DEFAULT_THEME_STYLE_PATH}" to application styles.`);
    context.logger.info('✅ All dependencies installed successfully.');

    return _tree;
  };
}
