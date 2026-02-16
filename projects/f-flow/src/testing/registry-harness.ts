import { FHasId, FIdRegistryBase } from '../f-storage';

export function registryAdd<T extends FHasId>(registry: FIdRegistryBase<T>, instance: T): T {
  registry.add(instance);

  return instance;
}

export function registryAddMany<T extends FHasId>(
  registry: FIdRegistryBase<T>,
  instances: readonly T[],
): readonly T[] {
  registry.addMany(instances);

  return instances;
}

export function registryGet<T extends FHasId>(
  registry: FIdRegistryBase<T>,
  id: string,
): T | undefined {
  return registry.get(id);
}

export function registryRequire<T extends FHasId>(registry: FIdRegistryBase<T>, id: string): T {
  return registry.require(id);
}

export function assertRegistryIds<T extends FHasId>(
  registry: FIdRegistryBase<T>,
  expectedIds: readonly string[],
): void {
  const actualIds = registry.getAll().map((item) => item.fId());
  const matches =
    actualIds.length === expectedIds.length &&
    actualIds.every((id, index) => id === expectedIds[index]);

  if (!matches) {
    throw new Error(
      `Registry ids mismatch. Expected: [${expectedIds.join(', ')}], actual: [${actualIds.join(', ')}].`,
    );
  }
}
