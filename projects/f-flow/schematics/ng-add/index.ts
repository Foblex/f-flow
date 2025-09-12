import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { FoblexDependencies } from '../shared/foblex-dependencies';

export function ngAdd(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('⚡ Installing @foblex/flow dependencies...');

    FoblexDependencies.forEach(dependency => {
      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Default,
        name: dependency.name,
        version: dependency.version,
      });
      context.logger.info(`✅ Added "${dependency.name}" to package.json`);
    });

    context.addTask(new NodePackageInstallTask());

    context.logger.info('✅ All dependencies installed successfully.');

    return tree;
  };
}
