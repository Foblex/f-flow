import { SchematicsException, Tree } from '@angular-devkit/schematics';

interface IPackageJson {
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
  optionalDependencies?: Record<string, string>;
}

const PACKAGE_JSON_PATH = '/package.json';

export function hasPackageJsonDependency(tree: Tree, packageName: string): boolean {
  const packageJson = readPackageJson(tree);

  return Boolean(
    packageJson.dependencies?.[packageName] ??
      packageJson.devDependencies?.[packageName] ??
      packageJson.peerDependencies?.[packageName] ??
      packageJson.optionalDependencies?.[packageName],
  );
}

function readPackageJson(tree: Tree): IPackageJson {
  const packageJsonBuffer = tree.read(PACKAGE_JSON_PATH);

  if (!packageJsonBuffer) {
    throw new SchematicsException('Could not find package.json in the workspace root.');
  }

  return JSON.parse(packageJsonBuffer.toString('utf-8')) as IPackageJson;
}
