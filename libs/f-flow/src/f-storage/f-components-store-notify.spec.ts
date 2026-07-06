import { FComponentsStore } from './f-components-store';

describe('FComponentsStore change notifications', () => {
  let store: FComponentsStore;

  beforeEach(() => {
    store = new FComponentsStore();
  });

  it('coalesces a burst of node change emissions into one notification', async () => {
    let notifications = 0;
    store.nodesChanges$.listen(() => notifications++);

    store.emitNodeChanges();
    store.emitNodeChanges();
    store.emitNodeChanges();

    expect(store.nodesRevision).toBe(3);
    expect(notifications).toBe(0);

    await Promise.resolve();

    expect(notifications).toBe(1);
  });

  it('notifies again for emissions after the microtask flushed', async () => {
    let notifications = 0;
    store.connectionsChanges$.listen(() => notifications++);

    store.emitConnectionChanges();
    await Promise.resolve();
    store.emitConnectionChanges();
    await Promise.resolve();

    expect(store.connectionsRevision).toBe(2);
    expect(notifications).toBe(2);
  });
});
