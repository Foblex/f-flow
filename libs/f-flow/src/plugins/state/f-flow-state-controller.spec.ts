import { ChangeDetectionStrategy, Component, EventEmitter, Injectable } from '@angular/core';
import { fakeAsync, TestBed, tick } from '@angular/core/testing';
import {
  configureDiTest,
  connectorFactory,
  FComponentsStore,
  FFlowModule,
  injectFromDi,
  injectFlowState,
  provideFFlow,
  registryAdd,
  valueProvider,
  withFlowState,
} from '@foblex/flow';
import { FConnectorBase } from '../../f-connectors';
import { FCanvasBase, FCanvasChangeEvent } from '../../f-canvas';
import { FFlowBase } from '../../f-flow/f-flow-base';
import {
  FCreateConnectionEvent,
  FCreateNodeEvent,
  FDeleteSelectedEvent,
  FDraggableBase,
  FDropToGroupEvent,
  FMoveNodesEvent,
  FReassignConnectionEvent,
  FSelectionChangeEvent,
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
  fSelectionChange: EventEmitter<FSelectionChangeEvent>;
  fDragStarted: EventEmitter<unknown>;
  fDragEnded: EventEmitter<void>;
}

function createFakeDraggable(): IFakeDraggable {
  return {
    fCreateConnection: new EventEmitter(),
    fReassignConnection: new EventEmitter(),
    fMoveNodes: new EventEmitter(),
    fDeleteSelected: new EventEmitter(),
    fDropToGroup: new EventEmitter(),
    fCreateNode: new EventEmitter(),
    fSelectionChange: new EventEmitter(),
    fDragStarted: new EventEmitter(),
    fDragEnded: new EventEmitter(),
  };
}

/** Simulates one drag session: start-tick work, then end-tick work. */
async function drag(d: IFakeDraggable, atStart: () => void, atEnd: () => void): Promise<void> {
  atStart();
  d.fDragStarted.emit(undefined);
  await Promise.resolve();
  atEnd();
  d.fDragEnded.emit();
  await Promise.resolve();
}

describe('FFlowStateController', () => {
  let store: FComponentsStore;
  let state: FFlowState;
  let controller: FFlowStateController;
  let draggable: IFakeDraggable;
  let canvas: {
    fCanvasChange: EventEmitter<FCanvasChangeEvent>;
    transform: {
      position: { x: number; y: number };
      scaledPosition: { x: number; y: number };
      scale: number;
    };
  };

  function setup(config?: IFFlowStateConfig): void {
    store = new FComponentsStore();
    draggable = createFakeDraggable();
    store.fDraggable = draggable as unknown as FDraggableBase;
    canvas = {
      fCanvasChange: new EventEmitter<FCanvasChangeEvent>(),
      transform: { position: { x: 0, y: 0 }, scaledPosition: { x: 0, y: 0 }, scale: 1 },
    };
    store.fCanvas = canvas as unknown as FCanvasBase;

    configureDiTest({
      providers: [
        FFlowStateController,
        FFlowState,
        valueProvider(FComponentsStore, store),
        valueProvider(
          F_FLOW_STATE_CONFIG,
          mergeFlowStateConfig({ canvasTransformDebounce: 0, ...config }),
        ),
      ],
    });

    state = injectFromDi(FFlowState);
    controller = injectFromDi(FFlowStateController);
    controller.initialize();

    state.load({
      nodes: [
        { id: 'a', position: { x: 0, y: 0 } },
        { id: 'b', position: { x: 200, y: 0 } },
      ],
      groups: [{ id: 'group-1', position: { x: 500, y: 0 }, size: { width: 300, height: 200 } }],
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

    expect(state.nodes().map((x) => x.id)).toEqual(['b']);
    expect(state.connections().length).toBe(0);

    state.undo();
    expect(state.nodes().length).toBe(2);
    expect(state.connections().length).toBe(1);
  });

  it('deletes a group and un-parents its children as one step', async () => {
    setup({ dropToGroup: true });
    // The drop and the delete are separate user actions (separate drag
    // sessions), so let each batch close before the next.
    draggable.fDropToGroup.emit(new FDropToGroupEvent('group-1', ['a'], { x: 0, y: 0 }));
    await Promise.resolve();
    expect(state.getNode('a')?.parentId).toBe('group-1');

    draggable.fDeleteSelected.emit(new FDeleteSelectedEvent([], ['group-1'], []));
    await Promise.resolve();

    expect(state.groups().length).toBe(0);
    expect(state.getNode('a')?.parentId).toBeNull();

    state.undo();
    expect(state.groups().map((x) => x.id)).toEqual(['group-1']);
    expect(state.getNode('a')?.parentId).toBe('group-1');
  });

  it('tracks the live selection without touching history when selectionInHistory is off', () => {
    setup({ selectionInHistory: false });

    draggable.fSelectionChange.emit(new FSelectionChangeEvent(['a'], ['group-1'], ['ab']));

    expect(state.selection()).toEqual({
      nodeIds: ['a'],
      groupIds: ['group-1'],
      connectionIds: ['ab'],
    });
    // Turned off: a selection change is not an undoable step.
    expect(state.canUndo()).toBeFalse();
  });

  it('makes selection an undoable step when selectionInHistory is on', () => {
    setup({ selectionInHistory: true });

    draggable.fSelectionChange.emit(new FSelectionChangeEvent(['a'], [], []));

    expect(state.selection().nodeIds).toEqual(['a']);
    expect(state.canUndo()).toBeTrue();

    state.undo();
    expect(state.selection().nodeIds).toEqual([]);
  });

  it('applies drops into groups', () => {
    setup({ dropToGroup: true });

    draggable.fDropToGroup.emit(new FDropToGroupEvent('group-1', ['a'], { x: 0, y: 0 }));

    expect(state.getNode('a')?.parentId).toBe('group-1');
  });

  it('nests an external item dropped over a group at the flow-space rect', () => {
    setup({ dropToGroup: true });

    // externalItemRect is flow-space; dropPosition is the raw pointer and must
    // NOT be used for the node position (that was the off-screen-node bug).
    draggable.fCreateNode.emit(
      new FCreateNodeEvent(
        RectExtensions.initialize(120, 80, 10, 10),
        { kind: 'task' },
        'group-1',
        {
          x: 900,
          y: 900,
        },
      ),
    );

    const created = state.nodes().find((n) => (n as { kind?: string }).kind === 'task');
    expect(created?.parentId).toBe('group-1');
    expect(created?.position).toEqual({ x: 120, y: 80 });
  });

  it('ignores group membership by default (dropToGroup off)', () => {
    setup();

    // An existing-node drop into a group is a no-op.
    draggable.fDropToGroup.emit(new FDropToGroupEvent('group-1', ['a'], { x: 0, y: 0 }));
    expect(state.getNode('a')?.parentId).toBeUndefined();
    expect(state.canUndo()).toBeFalse();

    // An external item over a group is created at the top level.
    draggable.fCreateNode.emit(
      new FCreateNodeEvent(RectExtensions.initialize(0, 0, 10, 10), { kind: 'x' }, 'group-1', {
        x: 0,
        y: 0,
      }),
    );
    const created = state.nodes().find((n) => (n as { kind?: string }).kind === 'x');
    expect(created?.parentId).toBeNull();
  });

  it('folds move + drop-to-group of one drag into a single undo step', async () => {
    setup({ dropToGroup: true });

    // Both events fire on the same pointer-up, inside one drag session.
    await drag(
      draggable,
      () => {},
      () => {
        draggable.fMoveNodes.emit(new FMoveNodesEvent([{ id: 'a', position: { x: 50, y: 50 } }]));
        draggable.fDropToGroup.emit(new FDropToGroupEvent('group-1', ['a'], { x: 0, y: 0 }));
      },
    );

    expect(state.getNode('a')?.position).toEqual({ x: 50, y: 50 });
    expect(state.getNode('a')?.parentId).toBe('group-1');

    // ONE undo reverts BOTH the move and the reparent.
    state.undo();
    expect(state.getNode('a')?.position).toEqual({ x: 0, y: 0 });
    expect(state.getNode('a')?.parentId).toBeUndefined();
    expect(state.canUndo()).toBeFalse();
  });

  it('folds a selection at drag-start with the move at drag-end into one step', async () => {
    setup({ selectionInHistory: true });
    const changesBefore = state.changes();

    // The selection is emitted at drag-start (before fDragStarted); the move
    // lands at drag-end — different ticks, one drag.
    await drag(
      draggable,
      () => draggable.fSelectionChange.emit(new FSelectionChangeEvent(['a'], [], [])),
      () =>
        draggable.fMoveNodes.emit(new FMoveNodesEvent([{ id: 'a', position: { x: 30, y: 30 } }])),
    );

    expect(state.getNode('a')?.position).toEqual({ x: 30, y: 30 });
    expect(state.selection().nodeIds).toEqual(['a']);
    expect(state.changes()).toBe(changesBefore + 1);

    // ONE undo reverts BOTH the selection and the move.
    state.undo();
    expect(state.getNode('a')?.position).toEqual({ x: 0, y: 0 });
    expect(state.selection().nodeIds).toEqual([]);
    expect(state.canUndo()).toBeFalse();
  });

  it('keeps separate drags as separate undo steps', async () => {
    setup();

    await drag(
      draggable,
      () => {},
      () =>
        draggable.fMoveNodes.emit(new FMoveNodesEvent([{ id: 'a', position: { x: 10, y: 10 } }])),
    );
    await drag(
      draggable,
      () => {},
      () =>
        draggable.fMoveNodes.emit(new FMoveNodesEvent([{ id: 'a', position: { x: 20, y: 20 } }])),
    );

    expect(state.getNode('a')?.position).toEqual({ x: 20, y: 20 });
    state.undo();
    expect(state.getNode('a')?.position).toEqual({ x: 10, y: 10 });
    state.undo();
    expect(state.getNode('a')?.position).toEqual({ x: 0, y: 0 });
  });

  it('adds a node when an external item is dropped', () => {
    setup();

    draggable.fCreateNode.emit(
      new FCreateNodeEvent(RectExtensions.initialize(5, 6, 10, 10), { kind: 'task' }, undefined, {
        x: 5,
        y: 6,
      }),
    );

    expect(state.nodes().length).toBe(3);
    const created = state.nodes()[2];
    expect(created.position).toEqual({ x: 5, y: 6 });
    // The item's fData is spread onto the node as its own fields.
    expect((created as { kind?: string }).kind).toBe('task');
  });

  it('captures a canvas pan/zoom into the transform as an undoable step', async () => {
    setup();

    canvas.fCanvasChange.emit(new FCanvasChangeEvent({ x: -80, y: 40 }, 1.5));
    await Promise.resolve();

    expect(state.transform()).toEqual({ position: { x: -80, y: 40 }, scale: 1.5 });
    expect(state.canUndo()).toBeTrue();

    state.undo();
    expect(state.transform()).toEqual({ position: undefined, scale: 1 });
  });

  it('tracks the transform live when canvasTransformInHistory is off', async () => {
    setup({ canvasTransformInHistory: false });

    canvas.fCanvasChange.emit(new FCanvasChangeEvent({ x: 10, y: 10 }, 2));
    await Promise.resolve();

    expect(state.transform()).toEqual({ position: { x: 10, y: 10 }, scale: 2 });
    expect(state.canUndo()).toBeFalse();
  });

  it('folds a drag-time canvas transform change into the drag move step', async () => {
    setup();

    // Initial centering was intentionally silent, so state.transform() is
    // unset even though the rendered canvas already has this transform.
    canvas.transform.position = { x: 100, y: 80 };

    // Simulates a node drag during which the canvas auto-panned/zoomed: the
    // canvas transform is already settled by drag end, but its (debounced)
    // fCanvasChange fires only AFTER fDragEnded. The controller reads the
    // transform at drag end so it still folds into the move's single step.
    await drag(
      draggable,
      () => {},
      () => {
        draggable.fMoveNodes.emit(new FMoveNodesEvent([{ id: 'a', position: { x: 30, y: 30 } }]));
        canvas.transform.position = { x: -50, y: -20 };
        canvas.transform.scale = 1.2;
      },
    );

    expect(state.getNode('a')?.position).toEqual({ x: 30, y: 30 });
    expect(state.transform()).toEqual({ position: { x: -50, y: -20 }, scale: 1.2 });

    // ONE undo reverts BOTH the move and the transform.
    state.undo();
    expect(state.getNode('a')?.position).toEqual({ x: 0, y: 0 });
    expect(state.transform()).toEqual({ position: { x: 100, y: 80 }, scale: 1 });
    expect(state.canUndo()).toBeFalse();
  });

  it('restores a silently centered canvas after its first pan is undone', async () => {
    setup();
    canvas.transform.position = { x: 147.5, y: 150 };

    await drag(
      draggable,
      () => {},
      () => {
        canvas.transform.position = { x: 247.5, y: 190 };
      },
    );

    expect(state.transform()).toEqual({ position: { x: 247.5, y: 190 }, scale: 1 });

    state.undo();

    expect(state.transform()).toEqual({ position: { x: 147.5, y: 150 }, scale: 1 });
    expect(state.canUndo()).toBeFalse();
  });

  it('resets and rerenders the flow when undo returns to the start of history', async () => {
    setup({ canvasTransformInHistory: true });
    const resetSpy = jasmine.createSpy('reset');
    const emitNodeChangesSpy = spyOn(store, 'emitNodeChanges');
    store.fFlow = { reset: resetSpy } as unknown as FFlowBase;

    // Record a user pan, then undo back to the start.
    canvas.fCanvasChange.emit(new FCanvasChangeEvent({ x: 40, y: 40 }, 1.5));
    await Promise.resolve();
    expect(state.canUndo()).toBeTrue();

    state.undo();

    expect(state.canUndo()).toBeFalse();
    expect(resetSpy).toHaveBeenCalledTimes(1);
    expect(emitNodeChangesSpy).toHaveBeenCalledTimes(1);
  });

  it('collapses a burst of canvas changes into one step when debounced', async () => {
    setup({ canvasTransformDebounce: 30 });

    canvas.transform.position = { x: 30, y: 0 };
    canvas.transform.scale = 1.3;
    canvas.fCanvasChange.emit(new FCanvasChangeEvent({ x: 10, y: 0 }, 1.1));
    canvas.fCanvasChange.emit(new FCanvasChangeEvent({ x: 20, y: 0 }, 1.2));
    canvas.fCanvasChange.emit(new FCanvasChangeEvent({ x: 30, y: 0 }, 1.3));

    // Still inside the debounce window: nothing recorded yet.
    expect(state.canUndo()).toBeFalse();

    await new Promise((resolve) => setTimeout(resolve, 60));

    // One step, carrying the latest value of the burst.
    expect(state.transform()).toEqual({ position: { x: 30, y: 0 }, scale: 1.3 });
    expect(state.canUndo()).toBeTrue();
    state.undo();
    expect(state.canUndo()).toBeFalse();
  });

  it('does not commit a stale debounced transform while the canvas is still moving', fakeAsync(() => {
    setup({ canvasTransformDebounce: 500 });

    canvas.transform.position = { x: 10, y: 0 };
    canvas.transform.scale = 1.1;
    canvas.fCanvasChange.emit(new FCanvasChangeEvent({ x: 10, y: 0 }, 1.1));

    tick(400);
    canvas.transform.position = { x: 20, y: 0 };
    canvas.transform.scale = 1.2;

    tick(100);

    expect(state.transform()).toEqual({ position: undefined, scale: 1 });
    expect(state.canUndo()).toBeFalse();

    tick(500);

    expect(state.transform()).toEqual({ position: { x: 20, y: 0 }, scale: 1.2 });
    expect(state.canUndo()).toBeTrue();
  }));

  it('leaves the transform unset when a drag does not move the canvas', async () => {
    setup();

    // A plain node drag: the canvas transform never changes during the drag.
    await drag(
      draggable,
      () => {},
      () => draggable.fMoveNodes.emit(new FMoveNodesEvent([{ id: 'a', position: { x: 5, y: 5 } }])),
    );

    // The move is the only step; position stays unset (undefined), not the origin.
    expect(state.transform()).toEqual({ position: undefined, scale: 1 });
    state.undo();
    expect(state.getNode('a')?.position).toEqual({ x: 0, y: 0 });
    expect(state.canUndo()).toBeFalse();
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
    draggable = createFakeDraggable();
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

@Component({
  standalone: true,
  imports: [FFlowModule],
  providers: [provideFFlow(withFlowState())],
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: ['f-flow { display: block; height: 400px; }'],
  template: `
    <f-flow (fFullRendered)="rendered()">
      <f-canvas>
        @for (node of state.nodes(); track node.id) {
          <div fNode [fNodeId]="node.id" [fNodePosition]="node.position"></div>
        }
      </f-canvas>
    </f-flow>
  `,
})
class StateRenderLifecycleHost {
  public readonly state = injectFlowState();
  public fullRenderedCount = 0;

  constructor() {
    this.state.load({
      nodes: [{ id: 'a', position: { x: 0, y: 0 } }],
      connections: [],
    });
  }

  public rendered(): void {
    this.fullRenderedCount++;
  }
}

describe('FFlowState render lifecycle', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StateRenderLifecycleHost],
    }).compileComponents();
  });

  it('emits fFullRendered after undo restores the start of history', fakeAsync(() => {
    const fixture = TestBed.createComponent(StateRenderLifecycleHost);
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    expect(fixture.componentInstance.fullRenderedCount).toBe(1);

    fixture.componentInstance.state.moveNodes([{ id: 'a', position: { x: 50, y: 50 } }]);
    fixture.detectChanges();
    fixture.componentInstance.state.undo();
    fixture.detectChanges();
    tick(300);
    fixture.detectChanges();

    expect(fixture.componentInstance.state.getNode('a')?.position).toEqual({ x: 0, y: 0 });
    expect(fixture.componentInstance.fullRenderedCount).toBe(2);
  }));
});
