import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import { NodePackageInstallTask } from '@angular-devkit/schematics/tasks';
import {
  addPackageJsonDependency,
  NodeDependencyType,
} from '@schematics/angular/utility/dependencies';
import { FoblexDependencies } from '../shared/foblex-dependencies';

export function ngUpdate(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    context.logger.info('🔄 Updating Foblex Flow dependencies...');

    FoblexDependencies.forEach(dependency => {
      addPackageJsonDependency(tree, {
        type: NodeDependencyType.Default,
        name: dependency.name,
        version: dependency.version,
      });
      context.logger.info(`✅ Updated "${dependency.name}" to version ${dependency.version}`);
    });

    context.addTask(new NodePackageInstallTask());
    context.logger.info('✅ All dependencies updated and installed successfully.');

    return tree;
  };
}
