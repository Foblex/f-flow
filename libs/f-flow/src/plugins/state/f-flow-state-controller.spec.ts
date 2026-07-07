import { EventEmitter, Injectable } from '@angular/core';
import {
  configureDiTest,
  connectorFactory,
  FComponentsStore,
  injectFromDi,
  registryAdd,
  valueProvider,
} from '@foblex/flow';
import { FConnectorBase } from '../../f-connectors';
import {
  FCreateConnectionEvent,
  FCreateNodeEvent,
  FDeleteSelectedEvent,
  FDraggableBase,
  FDropToGroupEvent,
  FMoveNodesEvent,
  FReassignConnectionEvent,
} from '../../f-draggable';
import { RectExtensions } from '@foblex/2d';
import { FFlowState } from './f-flow-state';
import { FFlowStateController } from './f-flow-state-controller';
import { F_FLOW_STATE_CONFIG, IFFlowStateConfig, mergeFlowStateConfig } from './i-f-flow-state';

interface IFakeDraggable {
  fCreateConnection: EventEmitter<FCreateConnectionEvent>;
  fReassignConnection: EventEmitter<FReassignConnectionEvent>;
  fMoveNodes: EventEmitter<FMoveNodesEvent>;
  fDeleteSelected: EventEmitter<FDeleteSelectedEvent>;
  fDropToGroup: EventEmitter<FDropToGroupEvent>;
  fCreateNode: EventEmitter<FCreateNodeEvent>;
}

describe('FFlowStateController', () => {
  let store: FComponentsStore;
  let state: FFlowState;
  let controller: FFlowStateController;
  let draggable: IFakeDraggable;

  function setup(config?: IFFlowStateConfig): void {
    store = new FComponentsStore();
    draggable = {
      fCreateConnection: new EventEmitter(),
      fReassignConnection: new EventEmitter(),
      fMoveNodes: new EventEmitter(),
      fDeleteSelected: new EventEmitter(),
      fDropToGroup: new EventEmitter(),
      fCreateNode: new EventEmitter(),
    };
    store.fDraggable = draggable as unknown as FDraggableBase;

    configureDiTest({
      providers: [
        FFlowStateController,
        FFlowState,
        valueProvider(FComponentsStore, store),
        valueProvider(F_FLOW_STATE_CONFIG, mergeFlowStateConfig(config)),
      ],
    });

    state = injectFromDi(FFlowState);
    controller = injectFromDi(FFlowStateController);
    controller.initialize();

    state.load({
      nodes: [
        { id: 'a', position: { x: 0, y: 0 } },
        { id: 'b', position: { x: 200, y: 0 } },
        { id: 'group-1', position: { x: 500, y: 0 } },
      ],
      connections: [{ id: 'ab', sourceId: 'a-out', targetId: 'b-in' }],
    });
  }

  afterEach(() => {
    controller.destroy();
  });

  it('adds a connection when a create gesture finishes on a target', () => {
    setup();

    draggable.fCreateConnection.emit(new FCreateConnectionEvent('a-out', 'b-in-2', { x: 0, y: 0 }));

    expect(state.connections().length).toBe(2);
    const created = state.connections()[1];
    expect(created.sourceId).toBe('a-out');
    expect(created.targetId).toBe('b-in-2');
    expect(created.id).toBeTruthy();
  });

  it('ignores connections dropped to nowhere', () => {
    setup();

    draggable.fCreateConnection.emit(
      new FCreateConnectionEvent('a-out', undefined, { x: 0, y: 0 }),
    );

    expect(state.connections().length).toBe(1);
  });

  it('lets a connectionFactory reject or shape the record', () => {
    setup({
      connectionFactory: (event) =>
        event.targetId === 'b-in-2'
          ? null
          : { id: 'custom', sourceId: event.sourceId, targetId: event.targetId as string },
    });

    draggable.fCreateConnection.emit(new FCreateConnectionEvent('a-out', 'b-in-2', { x: 0, y: 0 }));
    expect(state.connections().length).toBe(1);

    draggable.fCreateConnection.emit(new FCreateConnectionEvent('a-out', 'c-in', { x: 0, y: 0 }));
    expect(state.getConnection('custom')?.targetId).toBe('c-in');
  });

  it('applies reassignments to the state', () => {
    setup();

    draggable.fReassignConnection.emit(
      new FReassignConnectionEvent('ab', 'target', 'a-out', 'a-out', 'b-in', 'c-in', {
        x: 0,
        y: 0,
      }),
    );

    expect(state.getConnection('ab')?.targetId).toBe('c-in');
  });

  it('applies node moves as one history step', () => {
    setup();

    draggable.fMoveNodes.emit(
      new FMoveNodesEvent([
        { id: 'a', position: { x: 10, y: 10 } },
        { id: 'b', position: { x: 210, y: 10 } },
      ]),
    );

    expect(state.getNode('a')?.position).toEqual({ x: 10, y: 10 });
    state.undo();
    expect(state.getNode('a')?.position).toEqual({ x: 0, y: 0 });
    expect(state.getNode('b')?.position).toEqual({ x: 200, y: 0 });
  });

  it('deletes the selection with cascaded connections as one step', () => {
    setup();
    registryAdd<FConnectorBase>(
      store.connectors,
      connectorFactory().id('a-out').connectorType('source').nodeId('a').build(),
    );
    registryAdd<FConnectorBase>(
      store.connectors,
      connectorFactory().id('b-in').connectorType('target').nodeId('b').build(),
    );

    draggable.fDeleteSelected.emit(new FDeleteSelectedEvent(['a'], [], []));

    expect(state.nodes().map((x) => x.id)).toEqual(['b', 'group-1']);
    expect(state.connections().length).toBe(0);

    state.undo();
    expect(state.nodes().length).toBe(3);
    expect(state.connections().length).toBe(1);
  });

  it('applies drops into groups', () => {
    setup();

    draggable.fDropToGroup.emit(new FDropToGroupEvent('group-1', ['a'], { x: 0, y: 0 }));

    expect(state.getNode('a')?.parentId).toBe('group-1');
  });

  it('adds a node when an external item is dropped', () => {
    setup();

    draggable.fCreateNode.emit(
      new FCreateNodeEvent(RectExtensions.initialize(5, 6, 10, 10), { kind: 'task' }, undefined, {
        x: 5,
        y: 6,
      }),
    );

    expect(state.nodes().length).toBe(4);
    const created = state.nodes()[3];
    expect(created.position).toEqual({ x: 5, y: 6 });
    expect(created.data).toEqual({ kind: 'task' });
  });

  it('wires late-registered draggable directives', () => {
    setup();
    controller.destroy();

    store.fDraggable = undefined;
    controller.initialize();
    store.fDraggable = draggable as unknown as FDraggableBase;
    store.nodesChanges$.notify();

    draggable.fMoveNodes.emit(new FMoveNodesEvent([{ id: 'a', position: { x: 99, y: 0 } }]));

    expect(state.getNode('a')?.position).toEqual({ x: 99, y: 0 });
  });

  it('dispatches gestures through an overridden apply* handler', () => {
    @Injectable()
    class VetoState extends FFlowState {
      public override applyCreateConnection(): void {
        // This app creates connections only programmatically.
      }
    }
    store = new FComponentsStore();
    draggable = {
      fCreateConnection: new EventEmitter(),
      fReassignConnection: new EventEmitter(),
      fMoveNodes: new EventEmitter(),
      fDeleteSelected: new EventEmitter(),
      fDropToGroup: new EventEmitter(),
      fCreateNode: new EventEmitter(),
    };
    store.fDraggable = draggable as unknown as FDraggableBase;
    configureDiTest({
      providers: [
        FFlowStateController,
        { provide: FFlowState, useClass: VetoState },
        valueProvider(FComponentsStore, store),
        valueProvider(F_FLOW_STATE_CONFIG, mergeFlowStateConfig()),
      ],
    });
    state = injectFromDi(FFlowState);
    controller = injectFromDi(FFlowStateController);
    controller.initialize();
    state.load({ nodes: [], connections: [] });

    draggable.fCreateConnection.emit(new FCreateConnectionEvent('a-out', 'b-in', { x: 0, y: 0 }));

    expect(state.connections().length).toBe(0);
  });
});
