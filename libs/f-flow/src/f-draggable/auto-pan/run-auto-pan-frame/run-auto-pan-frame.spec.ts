import { Point } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { IMouseEvent } from '../../infrastructure';
import { FDraggableBase } from '../../f-draggable-base';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FAutoPanBase } from '../../../f-auto-pan';
import { FComponentsStore, INSTANCES } from '../../../f-storage';
import {
  canvasFactory,
  configureDiTest,
  flowFactory,
  injectFromDi,
  valueProvider,
} from '../../../testing';
import { DragHandlerBase } from '../../infrastructure';
import { RunAutoPanFrame } from './run-auto-pan-frame';
import { RunAutoPanFrameRequest } from './run-auto-pan-frame-request';
import { ScheduleAutoPanFrameRequest } from '../schedule-auto-pan-frame';
import { StopAutoPanRequest } from '../stop-auto-pan';

describe('RunAutoPanFrame', () => {
  let execution: RunAutoPanFrame;
  let dragContext: FDraggableDataContext;
  let store: FComponentsStore;
  let mediator: { execute: jasmine.Spy };

  beforeEach(() => {
    mediator = {
      execute: jasmine.createSpy('execute'),
    };

    configureDiTest({
      providers: [RunAutoPanFrame, valueProvider(FMediator, mediator as unknown as FMediator)],
    });

    execution = injectFromDi(RunAutoPanFrame);
    dragContext = injectFromDi(FDraggableDataContext);
    store = injectFromDi(FComponentsStore);

    const flowHost = document.createElement('div');
    spyOn(flowHost, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 0, 400, 300));

    store.fFlow = flowFactory().host(flowHost).build();
    store.fDraggable = createDraggableStub() as unknown as FDraggableBase;
    store.instances.add(INSTANCES.AUTO_PAN, createAutoPanStub() as FAutoPanBase);

    const builtCanvas = canvasFactory().build() as FComponentsStore['fCanvas'] & {
      redraw: jasmine.Spy;
    };
    builtCanvas.redraw = jasmine.createSpy('redraw');
    store.fCanvas = builtCanvas;
  });

  it('should auto-pan and rebase pointer down position for create connection', () => {
    const moveSpy = jasmine.createSpy('onPointerMove');

    dragContext.draggableItems = [createHandlerStub('create-connection', moveSpy)];
    dragContext.onPointerDownScale = 1;
    dragContext.onPointerDownPosition = new Point(120, 80);
    dragContext.rememberPointerPosition(createMouseEvent(395, 80));

    execution.handle(new RunAutoPanFrameRequest());

    expect(store.transform.position.x).toBe(-10);
    expect(store.transform.position.y).toBe(0);
    expect(dragContext.onPointerDownPosition.x).toBe(110);
    expect(dragContext.onPointerDownPosition.y).toBe(80);
    expect(dragContext.isAutoPanCanvasMoved).toBeTrue();
    expect(store.fCanvas?.redraw).toHaveBeenCalled();
    expect(moveSpy).toHaveBeenCalled();
    expect(mediator.execute).toHaveBeenCalledWith(jasmine.any(ScheduleAutoPanFrameRequest));
  });

  it('should keep pointer down position fixed for selection area', () => {
    dragContext.draggableItems = [createHandlerStub('selection-area')];
    dragContext.onPointerDownScale = 1;
    dragContext.onPointerDownPosition = new Point(40, 50);
    dragContext.rememberPointerPosition(createMouseEvent(395, 50));

    execution.handle(new RunAutoPanFrameRequest());

    expect(store.transform.position.x).toBe(-10);
    expect(dragContext.onPointerDownPosition.x).toBe(40);
    expect(dragContext.onPointerDownPosition.y).toBe(50);
  });

  it('should stop auto-pan for unsupported drag kinds', () => {
    dragContext.draggableItems = [createHandlerStub('drag-external-item')];
    dragContext.rememberPointerPosition(createMouseEvent(395, 80));

    execution.handle(new RunAutoPanFrameRequest());

    expect(mediator.execute).toHaveBeenCalledWith(jasmine.any(StopAutoPanRequest));
    expect(store.fCanvas?.redraw).not.toHaveBeenCalled();
  });
});

function createDraggableStub(): Partial<FDraggableBase> {
  return {
    isDragStarted: true,
  };
}

function createAutoPanStub(): Partial<FAutoPanBase> {
  return {
    fEdgeThreshold: (() => 40) as unknown as FAutoPanBase['fEdgeThreshold'],
    fSpeed: (() => 10) as unknown as FAutoPanBase['fSpeed'],
    fAcceleration: (() => false) as unknown as FAutoPanBase['fAcceleration'],
  };
}

function createHandlerStub(
  kind: string,
  onPointerMove: jasmine.Spy = jasmine.createSpy('onPointerMove'),
): DragHandlerBase<unknown> {
  return {
    getEvent: () => ({ kind, fEventType: kind }),
    onPointerMove,
  } as unknown as DragHandlerBase<unknown>;
}

function createMouseEvent(clientX: number, clientY: number): IMouseEvent {
  return new IMouseEvent(
    new MouseEvent('mousemove', {
      clientX,
      clientY,
      button: 0,
      buttons: 1,
    }),
  );
}
