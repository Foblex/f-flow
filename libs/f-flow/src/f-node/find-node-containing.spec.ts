import { FComponentsStore, findNodeOrGroupContaining, nodeFactory } from '@foblex/flow';

describe('findNodeOrGroupContaining', () => {
  let store: FComponentsStore;

  function addNode(id: string, attribute: 'data-f-node-id' | 'data-f-group-id' = 'data-f-node-id') {
    const host = document.createElement('div');
    host.setAttribute(attribute, id);
    document.body.appendChild(host);
    const node = nodeFactory().id(id).host(host).build();
    store.nodes.add(node);

    return { node, host };
  }

  beforeEach(() => {
    store = new FComponentsStore();
  });

  afterEach(() => {
    document.querySelectorAll('[data-f-node-id], [data-f-group-id]').forEach((x) => x.remove());
  });

  it('resolves the node owning a nested target element', () => {
    const { node, host } = addNode('a');
    const inner = document.createElement('span');
    host.appendChild(inner);

    expect(findNodeOrGroupContaining(store, inner)).toBe(node);
  });

  it('resolves group hosts through data-f-group-id', () => {
    const { node, host } = addNode('g1', 'data-f-group-id');

    expect(findNodeOrGroupContaining(store, host)).toBe(node);
  });

  it('returns undefined for elements outside any node host', () => {
    addNode('a');
    const stray = document.createElement('div');
    document.body.appendChild(stray);

    expect(findNodeOrGroupContaining(store, stray)).toBeUndefined();
    stray.remove();
  });

  it('rejects hosts whose id belongs to a different flow', () => {
    // A registered node with id "a" but a DIFFERENT host than the matched one.
    addNode('a');
    const foreignHost = document.createElement('div');
    foreignHost.setAttribute('data-f-node-id', 'a');
    document.body.appendChild(foreignHost);

    expect(findNodeOrGroupContaining(store, foreignHost)).toBeUndefined();
  });
});
