import { Injectable } from '@angular/core';
import { RectExtensions } from '@foblex/2d';
import { configureDiTest, injectFromDi, valueProvider } from '@foblex/flow';
import { FSelectionChangeEvent } from '../../f-draggable';
import { FFlowState } from './f-flow-state';
import { IFStateNode } from './i-f-state-models';
import { F_FLOW_STATE_CONFIG, mergeFlowStateConfig } from './i-f-flow-state';

interface INode extends IFStateNode {
  label?: string;
}

describe('FFlowState', () => {
  let state: FFlowState<INode>;

  function setup(): void {
    configureDiTest({ providers: [FFlowState] });
    state = injectFromDi(FFlowState) as FFlowState<INode>;
  }

  function loadSample(): void {
    setup();
    state.load({
      nodes: [
        { id: 'a', position: { x: 0, y: 0 }, label: 'A' },
        { id: 'b', position: { x: 200, y: 0 }, label: 'B' },
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
    expect(state.getNode('a')?.label).toBe('A');
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

  function loadWithGroup(): void {
    setup();
    state.load({
      nodes: [
        { id: 'a', position: { x: 20, y: 20 }, parentId: 'g1', label: 'A' },
        { id: 'b', position: { x: 200, y: 0 }, label: 'B' },
      ],
      groups: [{ id: 'g1', position: { x: 0, y: 0 }, size: { width: 300, height: 200 } }],
      connections: [{ id: 'ab', sourceId: 'a-out', targetId: 'b-in' }],
    });
  }

  it('manages groups as their own collection', () => {
    loadWithGroup();

    expect(state.groups().map((x) => x.id)).toEqual(['g1']);
    expect(state.getGroup('g1')?.size).toEqual({ width: 300, height: 200 });

    state.addGroups({ id: 'g2', position: { x: 400, y: 0 } });
    expect(state.groups().length).toBe(2);

    state.updateGroup('g2', { position: { x: 420, y: 10 } });
    expect(state.getGroup('g2')?.position).toEqual({ x: 420, y: 10 });

    state.undo();
    expect(state.getGroup('g2')?.position).toEqual({ x: 400, y: 0 });
  });

  it('moves a group alongside nodes in one step', () => {
    loadWithGroup();

    state.moveNodes([
      { id: 'a', position: { x: 25, y: 25 } },
      { id: 'g1', position: { x: 5, y: 5 } },
    ]);
    expect(state.getNode('a')?.position).toEqual({ x: 25, y: 25 });
    expect(state.getGroup('g1')?.position).toEqual({ x: 5, y: 5 });

    state.undo();
    expect(state.getNode('a')?.position).toEqual({ x: 20, y: 20 });
    expect(state.getGroup('g1')?.position).toEqual({ x: 0, y: 0 });
  });

  it('un-parents children and cascades connections when a group is removed', () => {
    loadWithGroup();
    state._connectorOwnerResolver = (connectorId) =>
      connectorId.startsWith('a-') ? 'a' : connectorId.startsWith('b-') ? 'b' : undefined;

    state.removeGroups(['g1']);

    expect(state.groups().length).toBe(0);
    // The child stays, but its dangling parentId is cleared.
    expect(state.getNode('a')?.parentId).toBeNull();
    // The group itself owns no connector here, so the connection survives.
    expect(state.connections().length).toBe(1);

    state.undo();
    expect(state.getGroup('g1')).toBeTruthy();
    expect(state.getNode('a')?.parentId).toBe('g1');
  });

  it('round-trips groups through snapshot()', () => {
    loadWithGroup();

    const snapshot = state.snapshot();
    expect(snapshot.groups.map((x) => x.id)).toEqual(['g1']);

    state.load({ nodes: [], groups: [], connections: [] });
    expect(state.groups().length).toBe(0);

    state.load(snapshot);
    expect(state.groups().map((x) => x.id)).toEqual(['g1']);
    expect(state.getNode('a')?.parentId).toBe('g1');
  });

  it('ticks changes() once per history step and on load', () => {
    loadSample();
    const start = state.changes();

    state.addNodes({ id: 'c', position: { x: 0, y: 0 } });
    state.undo();
    state.redo();
    expect(state.changes()).toBe(start + 3);

    state.load({ nodes: [], connections: [] });
    expect(state.changes()).toBe(start + 4);
  });

  it('keeps selection out of history by default but exposes it as a signal', () => {
    loadSample();
    const changesBefore = state.changes();

    state.applySelectionChange(new FSelectionChangeEvent(['a'], [], ['ab']));

    expect(state.selection().nodeIds).toEqual(['a']);
    expect(state.canUndo()).toBeFalse();
    // A selection-only event is not a graph change.
    expect(state.changes()).toBe(changesBefore);
  });

  it('collapses a batch() of mutations into one undoable step', () => {
    loadSample();

    state.batch(() => {
      state.addNodes({ id: 'c', position: { x: 1, y: 1 } });
      state.moveNodes([{ id: 'a', position: { x: 9, y: 9 } }]);
    });

    expect(state.nodes().length).toBe(3);
    expect(state.getNode('a')?.position).toEqual({ x: 9, y: 9 });

    // One undo reverts BOTH the add and the move.
    state.undo();
    expect(state.nodes().length).toBe(2);
    expect(state.getNode('a')?.position).toEqual({ x: 0, y: 0 });
    expect(state.canUndo()).toBeFalse();
  });

  it('folds a resize into the last step (applyResize), not a new one', () => {
    loadWithGroup();

    state.addNodes({ id: 'c', position: { x: 5, y: 5 } }); // one history step
    // A group auto-fit is a consequence of the add — no step of its own.
    state.applyResize('g1', RectExtensions.initialize(10, 10, 260, 180));

    expect(state.getGroup('g1')?.size).toEqual({ width: 260, height: 180 });
    expect(state.getGroup('g1')?.position).toEqual({ x: 10, y: 10 });

    // ONE undo reverts the add AND the resize.
    state.undo();
    expect(state.getNode('c')).toBeUndefined();
    expect(state.getGroup('g1')?.size).toEqual({ width: 300, height: 200 });
    expect(state.canUndo()).toBeFalse();
  });

  it('ignores a resize that does not change the geometry', () => {
    loadWithGroup(); // g1 at {0,0} sized 300x200
    const changesBefore = state.changes();

    state.applyResize('g1', RectExtensions.initialize(0, 0, 300, 200));

    expect(state.changes()).toBe(changesBefore);
  });
});
