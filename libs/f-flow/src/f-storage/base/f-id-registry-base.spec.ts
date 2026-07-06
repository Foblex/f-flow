import { signal } from '@angular/core';
import { FHasId, FIdRegistryBase } from './f-id-registry-base';

class TestRegistry extends FIdRegistryBase<FHasId> {
  protected readonly kind = 'test';
}

function item(id: string): FHasId {
  return { fId: signal(id) };
}

describe('FIdRegistryBase', () => {
  let registry: TestRegistry;

  beforeEach(() => {
    registry = new TestRegistry();
  });

  it('compacts pending removals while preserving insertion order', () => {
    const items = ['a', 'b', 'c', 'd'].map(item);
    registry.addMany(items);

    registry.remove(items[1]);
    registry.removeById('d');

    expect(registry.getAll().map((x) => x.fId())).toEqual(['a', 'c']);
    expect(registry.size()).toBe(2);
  });

  it('hides removed instances from id lookups before compaction', () => {
    const a = item('a');
    registry.add(a);
    registry.remove(a);

    expect(registry.get('a')).toBeUndefined();
    expect(registry.has('a')).toBeFalse();
    expect(registry.size()).toBe(0);
  });

  it('keeps the getAll() array identity across compactions', () => {
    const items = ['a', 'b', 'c'].map(item);
    registry.addMany(items);
    const reference = registry.getAll();

    registry.remove(items[0]);

    expect(registry.getAll()).toBe(reference);
    expect(reference.map((x) => x.fId())).toEqual(['b', 'c']);
  });

  it('re-adds the same instance to the end without duplication', () => {
    const items = ['a', 'b'].map(item);
    registry.addMany(items);

    registry.remove(items[0]);
    registry.add(items[0]);

    expect(registry.getAll().map((x) => x.fId())).toEqual(['b', 'a']);
    expect(registry.size()).toBe(2);
  });

  it('re-adds a new instance under a removed id', () => {
    const original = item('a');
    registry.add(original);
    registry.remove(original);

    const replacement = item('a');
    registry.add(replacement);

    expect(registry.getAll()).toEqual([replacement]);
    expect(registry.get('a')).toBe(replacement);
  });

  it('still throws on duplicate ids', () => {
    registry.add(item('a'));

    expect(() => registry.add(item('a'))).toThrowError('test already exists: a');
  });

  it('clear drops everything including pending removals', () => {
    const items = ['a', 'b'].map(item);
    registry.addMany(items);
    registry.remove(items[0]);

    registry.clear();

    expect(registry.getAll()).toEqual([]);
    expect(registry.size()).toBe(0);
  });
});
