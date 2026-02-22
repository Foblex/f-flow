import { FNodeSizeRegistry } from './f-node-size-registry';

describe('FNodeSizeRegistry', () => {
  let registry: FNodeSizeRegistry;

  beforeEach(() => {
    registry = new FNodeSizeRegistry();
  });

  it('should register a node with default estimated size', () => {
    registry.register('node-1');

    expect(registry.has('node-1')).toBeTrue();
    expect(registry.getSize('node-1')).toEqual({ width: 200, height: 100 });
  });

  it('should return default estimated size for unknown nodes', () => {
    expect(registry.getSize('unknown')).toEqual({ width: 200, height: 100 });
  });

  it('should use custom default estimated size', () => {
    registry.setDefaultEstimatedSize({ width: 300, height: 150 });
    registry.register('node-1');

    expect(registry.getSize('node-1')).toEqual({ width: 300, height: 150 });
  });

  it('should return measured size when available', () => {
    registry.register('node-1');
    registry.setMeasuredSize('node-1', { width: 250, height: 120 });

    expect(registry.getSize('node-1')).toEqual({ width: 250, height: 120 });
  });

  it('should return estimated size when measured size is cleared', () => {
    registry.register('node-1');
    registry.setMeasuredSize('node-1', { width: 250, height: 120 });
    registry.clearMeasuredSize('node-1');

    expect(registry.getSize('node-1')).toEqual({ width: 200, height: 100 });
  });

  it('should unregister a node', () => {
    registry.register('node-1');
    registry.unregister('node-1');

    expect(registry.has('node-1')).toBeFalse();
  });

  it('should not overwrite existing entry on re-register', () => {
    registry.register('node-1');
    registry.setMeasuredSize('node-1', { width: 250, height: 120 });
    registry.register('node-1');

    expect(registry.getSize('node-1')).toEqual({ width: 250, height: 120 });
  });

  it('should clear all entries', () => {
    registry.register('node-1');
    registry.register('node-2');
    registry.clear();

    expect(registry.has('node-1')).toBeFalse();
    expect(registry.has('node-2')).toBeFalse();
  });

  it('should return undefined for getMeasuredSize when not measured', () => {
    registry.register('node-1');

    expect(registry.getMeasuredSize('node-1')).toBeUndefined();
  });

  it('should return measured size from getMeasuredSize', () => {
    registry.register('node-1');
    registry.setMeasuredSize('node-1', { width: 250, height: 120 });

    expect(registry.getMeasuredSize('node-1')).toEqual({ width: 250, height: 120 });
  });
});
