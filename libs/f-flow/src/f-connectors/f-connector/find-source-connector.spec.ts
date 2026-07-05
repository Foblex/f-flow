import {
  connectorFactory,
  FComponentsStore,
  FConnectorBase,
  findSourceConnector,
  registryAdd,
  requireSourceConnector,
} from '@foblex/flow';

describe('findSourceConnector', () => {
  let store: FComponentsStore;

  beforeEach(() => {
    store = new FComponentsStore();
  });

  it('resolves a unified connector with type source', () => {
    store.connectors.add(connectorFactory().id('a').connectorType('source').build());

    expect(findSourceConnector(store, 'a')?.fId()).toBe('a');
  });

  it('resolves a unified connector with type source-target', () => {
    store.connectors.add(connectorFactory().id('a').connectorType('source-target').build());

    expect(findSourceConnector(store, 'a')?.fId()).toBe('a');
  });

  it('does not resolve a unified connector with type target', () => {
    store.connectors.add(connectorFactory().id('a').connectorType('target').build());

    expect(findSourceConnector(store, 'a')).toBeUndefined();
  });

  it('does not resolve a unified connector with type outlet', () => {
    store.connectors.add(connectorFactory().id('a').connectorType('outlet').build());

    expect(findSourceConnector(store, 'a')).toBeUndefined();
  });

  it('falls back to the legacy outputs registry', () => {
    registryAdd<FConnectorBase>(store.outputs, connectorFactory().id('a').kind('output').build());

    expect(findSourceConnector(store, 'a')?.kind).toBe('output');
  });

  it('prefers the unified registry over the legacy one', () => {
    store.connectors.add(connectorFactory().id('a').connectorType('source').build());
    registryAdd<FConnectorBase>(store.outputs, connectorFactory().id('a').kind('output').build());

    expect(findSourceConnector(store, 'a')?.kind).toBe('connector');
  });

  it('requireSourceConnector throws for an unknown id', () => {
    expect(() => requireSourceConnector(store, 'missing')).toThrowError(
      'Source connector not found: missing',
    );
  });
});
