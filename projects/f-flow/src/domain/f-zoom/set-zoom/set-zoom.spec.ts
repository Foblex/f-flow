import { Point, PointExtensions } from '@foblex/2d';
import {
  canvasFactory,
  configureDiTest,
  DragHandlerBase,
  FComponentsStore,
  FDraggableBase,
  FDraggableDataContext,
  EFZoomDirection,
  flowFactory,
  FZoomBase,
  injectFromDi,
  INSTANCES,
  IsDragStarted,
  SetZoom,
  SetZoomRequest,
} from '@foblex/flow';

describe('SetZoom (unit)', () => {
  let execution: SetZoom;
  let store: FComponentsStore;
  let dragContext: FDraggableDataContext;

  beforeEach(() => {
    configureDiTest({ providers: [SetZoom, IsDragStarted] });

    execution = injectFromDi(SetZoom);
    store = injectFromDi(FComponentsStore);
    dragContext = injectFromDi(FDraggableDataContext);

    const host = document.createElement('div');
    spyOn(host, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 0, 800, 600));

    store.fFlow = flowFactory().host(host).build();
    store.fCanvas = canvasFactory().build();
    (store.fCanvas as unknown as { emitCanvasChangeEvent: () => void }).emitCanvasChangeEvent =
      () => {
        // no-op
      };
    store.instances.add(INSTANCES.ZOOM, {
      minimum: 0.1,
      maximum: 4,
    } as unknown as FZoomBase);
  });

  it('should rebase drag context and zoom while dragging node', () => {
    store.fDraggable = { isDragStarted: true } as unknown as FDraggableBase;
    dragContext.draggableItems = [createHandlerStub('drag-node')];
    dragContext.onPointerDownScale = 1;
    dragContext.onPointerDownPosition = new Point(10, 20);

    execution.handle(
      new SetZoomRequest(PointExtensions.initialize(100, 200), 0.5, EFZoomDirection.ZOOM_IN, false),
    );

    const expectedScaleDelta = 1 / 1.5 - 1;
    expect(store.fCanvas?.transform.scale).toBe(1.5);
    expect(dragContext.onPointerDownScale).toBe(1.5);
    expect(dragContext.onPointerDownPosition.x).toBeCloseTo(10 + 100 * expectedScaleDelta, 6);
    expect(dragContext.onPointerDownPosition.y).toBeCloseTo(20 + 200 * expectedScaleDelta, 6);
  });

  it('should apply zoom without rebase for drag-canvas', () => {
    store.fDraggable = { isDragStarted: true } as unknown as FDraggableBase;
    dragContext.draggableItems = [createHandlerStub('drag-canvas')];
    dragContext.onPointerDownScale = 1;
    dragContext.onPointerDownPosition = new Point(10, 20);

    execution.handle(
      new SetZoomRequest(PointExtensions.initialize(100, 200), 0.5, EFZoomDirection.ZOOM_IN, false),
    );

    expect(store.fCanvas?.transform.scale).toBe(1.5);
    expect(dragContext.onPointerDownScale).toBe(1);
    expect(dragContext.onPointerDownPosition.x).toBe(10);
    expect(dragContext.onPointerDownPosition.y).toBe(20);
  });

  it('should keep zoom blocked for unsupported drag handlers', () => {
    store.fDraggable = { isDragStarted: true } as unknown as FDraggableBase;
    dragContext.draggableItems = [createHandlerStub('unsupported-kind')];
    dragContext.onPointerDownScale = 1;
    dragContext.onPointerDownPosition = new Point(10, 20);

    execution.handle(
      new SetZoomRequest(PointExtensions.initialize(100, 200), 0.5, EFZoomDirection.ZOOM_IN, false),
    );

    expect(store.fCanvas?.transform.scale).toBe(1);
    expect(dragContext.onPointerDownScale).toBe(1);
    expect(dragContext.onPointerDownPosition.x).toBe(10);
    expect(dragContext.onPointerDownPosition.y).toBe(20);
  });
});

function createHandlerStub(kind: string): DragHandlerBase<unknown> {
  return {
    getEvent: () => ({ kind, fEventType: kind }),
    onPointerMove: () => {
      // no-op
    },
  } as unknown as DragHandlerBase<unknown>;
}
