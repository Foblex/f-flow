import { Injectable } from '@angular/core';
import { configureDiTest, injectFromDi, valueProvider } from '@foblex/flow';
import { FFlowState } from './f-flow-state';
import { F_FLOW_STATE_CONFIG, mergeFlowStateConfig } from './i-f-flow-state';

describe('FFlowState', () => {
  let state: FFlowState<{ label: string }>;

  function setup(): void {
    configureDiTest({ providers: [FFlowState] });
    state = injectFromDi(FFlowState) as FFlowState<{ label: string }>;
  }

  function loadSample(): void {
    setup();
    state.load({
      nodes: [
        { id: 'a', position: { x: 0, y: 0 }, data: { label: 'A' } },
        { id: 'b', position: { x: 200, y: 0 }, data: { label: 'B' } },
      ],
      connections: [{ id: 'ab', sourceId: 'a-out', targetId: 'b-in' }],
    });
  }

  it('loads data into signals and starts with a clean history', () => {
    loadSample();

    expect(state.nodes().map((x) => x.id)).toEqual(['a', 'b']);
    expect(state.connections().map((x) => x.id)).toEqual(['ab']);
    expect(state.canUndo()).toBeFalse();
    expect(state.canRedo()).toBeFalse();
  });

  it('adds nodes as an undoable step', () => {
    loadSample();

    state.addNodes({ id: 'c', position: { x: 400, y: 0 } });
    expect(state.nodes().length).toBe(3);
    expect(state.canUndo()).toBeTrue();

    state.undo();
    expect(state.nodes().length).toBe(2);

    state.redo();
    expect(state.nodes().length).toBe(3);
  });

  it('moves several nodes as ONE history step', () => {
    loadSample();

    state.moveNodes([
      { id: 'a', position: { x: 10, y: 10 } },
      { id: 'b', position: { x: 210, y: 10 } },
    ]);
    expect(state.getNode('a')?.position).toEqual({ x: 10, y: 10 });
    expect(state.getNode('b')?.position).toEqual({ x: 210, y: 10 });

    state.undo();
    expect(state.getNode('a')?.position).toEqual({ x: 0, y: 0 });
    expect(state.getNode('b')?.position).toEqual({ x: 200, y: 0 });
    expect(state.canUndo()).toBeFalse();
  });

  it('deep-patches a node without losing its payload', () => {
    loadSample();

    state.updateNode('a', { position: { x: 50, y: 5 } });

    expect(state.getNode('a')?.position).toEqual({ x: 50, y: 5 });
    expect(state.getNode('a')?.data).toEqual({ label: 'A' });
  });

  it('ignores unknown ids in moves and patches', () => {
    loadSample();

    state.moveNodes([{ id: 'ghost', position: { x: 1, y: 1 } }]);
    state.updateNode('ghost', { position: { x: 1, y: 1 } });

    expect(state.canUndo()).toBeFalse();
    expect(state.nodes().length).toBe(2);
  });

  it('cascades attached connections when removing nodes (with a resolver)', () => {
    loadSample();
    state._connectorOwnerResolver = (connectorId) =>
      connectorId.startsWith('a-') ? 'a' : connectorId.startsWith('b-') ? 'b' : undefined;

    state.removeNodes(['a']);

    expect(state.nodes().map((x) => x.id)).toEqual(['b']);
    expect(state.connections().length).toBe(0);
    expect(state.canUndo()).toBeTrue();

    // The whole removal is one step.
    state.undo();
    expect(state.nodes().length).toBe(2);
    expect(state.connections().length).toBe(1);
  });

  it('removes nodes without cascade when no resolver is installed', () => {
    loadSample();

    state.removeNodes(['a']);

    expect(state.nodes().map((x) => x.id)).toEqual(['b']);
    expect(state.connections().length).toBe(1);
  });

  it('updates connection endpoints', () => {
    loadSample();

    state.updateConnection('ab', { targetId: 'b-in-2' });

    expect(state.getConnection('ab')?.targetId).toBe('b-in-2');
    state.undo();
    expect(state.getConnection('ab')?.targetId).toBe('b-in');
  });

  it('round-trips through snapshot()', () => {
    loadSample();
    state.addNodes({ id: 'c', position: { x: 400, y: 0 } });

    const snapshot = state.snapshot();
    state.load({ nodes: [], connections: [] });
    expect(state.nodes().length).toBe(0);

    state.load(snapshot);
    expect(state.nodes().map((x) => x.id)).toEqual(['a', 'b', 'c']);
    expect(state.connections().length).toBe(1);
  });

  it('resets the history on load', () => {
    loadSample();
    state.addNodes({ id: 'c', position: { x: 400, y: 0 } });

    state.load({ nodes: [], connections: [] });

    expect(state.canUndo()).toBeFalse();
    expect(state.canRedo()).toBeFalse();
  });

  it('drops the oldest steps beyond the history limit', () => {
    configureDiTest({
      providers: [
        FFlowState,
        valueProvider(F_FLOW_STATE_CONFIG, mergeFlowStateConfig({ historyLimit: 2 })),
      ],
    });
    const limited = injectFromDi(FFlowState);
    limited.load({ nodes: [], connections: [] });

    limited.addNodes({ id: 'a', position: { x: 0, y: 0 } });
    limited.addNodes({ id: 'b', position: { x: 1, y: 0 } });
    limited.addNodes({ id: 'c', position: { x: 2, y: 0 } });

    limited.undo();
    limited.undo();
    // The first step fell off the capped history: 'a' can no longer be undone.
    expect(limited.canUndo()).toBeFalse();
    expect(limited.nodes().map((x) => x.id)).toEqual(['a']);
  });

  it('is fully overridable: a subclass changes what a mutation does', () => {
    @Injectable()
    class PinnedState extends FFlowState {
      public override moveNodes(): void {
        // This app forbids moving nodes entirely.
      }
    }
    configureDiTest({
      providers: [
        { provide: FFlowState, useClass: PinnedState },
        valueProvider(F_FLOW_STATE_CONFIG, mergeFlowStateConfig()),
      ],
    });
    const pinned = injectFromDi(FFlowState);
    pinned.load({ nodes: [{ id: 'a', position: { x: 0, y: 0 } }], connections: [] });

    pinned.moveNodes([{ id: 'a', position: { x: 99, y: 99 } }]);

    expect(pinned.getNode('a')?.position).toEqual({ x: 0, y: 0 });
    expect(pinned.canUndo()).toBeFalse();
  });
});
