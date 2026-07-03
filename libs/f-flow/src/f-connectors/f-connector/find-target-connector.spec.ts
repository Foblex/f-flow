import {
  connectorFactory,
  FComponentsStore,
  FConnectorBase,
  findTargetConnector,
  registryAdd,
  requireTargetConnector,
} from '@foblex/flow';

describe('findTargetConnector', () => {
  let store: FComponentsStore;

  beforeEach(() => {
    store = new FComponentsStore();
  });

  it('resolves a unified connector with type target', () => {
    store.connectors.add(connectorFactory().id('b').connectorType('target').build());

    expect(findTargetConnector(store, 'b')?.fId()).toBe('b');
  });

  it('resolves a unified connector with type source-target', () => {
    store.connectors.add(connectorFactory().id('b').connectorType('source-target').build());

    expect(findTargetConnector(store, 'b')?.fId()).toBe('b');
  });

  it('does not resolve a unified connector with type source', () => {
    store.connectors.add(connectorFactory().id('b').connectorType('source').build());

    expect(findTargetConnector(store, 'b')).toBeUndefined();
  });

  it('does not resolve a unified connector with type outlet', () => {
    store.connectors.add(connectorFactory().id('b').connectorType('outlet').build());

    expect(findTargetConnector(store, 'b')).toBeUndefined();
  });

  it('falls back to the legacy inputs registry', () => {
    registryAdd<FConnectorBase>(store.inputs, connectorFactory().id('b').kind('input').build());

    expect(findTargetConnector(store, 'b')?.kind).toBe('input');
  });

  it('prefers the unified registry over the legacy one', () => {
    store.connectors.add(connectorFactory().id('b').connectorType('target').build());
    registryAdd<FConnectorBase>(store.inputs, connectorFactory().id('b').kind('input').build());

    expect(findTargetConnector(store, 'b')?.kind).toBe('connector');
  });

  it('requireTargetConnector throws for an unknown id', () => {
    expect(() => requireTargetConnector(store, 'missing')).toThrowError(
      'Target connector not found: missing',
    );
  });
});
