import { FMediator } from '@foblex/mediator';
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
import { ScheduleAutoPanFrame } from './schedule-auto-pan-frame';
import { ScheduleAutoPanFrameRequest } from './schedule-auto-pan-frame-request';
import { RunAutoPanFrameRequest } from '../run-auto-pan-frame';
import { StopAutoPanRequest } from '../stop-auto-pan';

describe('ScheduleAutoPanFrame', () => {
  let execution: ScheduleAutoPanFrame;
  let dragContext: FDraggableDataContext;
  let store: FComponentsStore;
  let mediator: { execute: jasmine.Spy };
  let frameCallback: FrameRequestCallback | null;

  beforeEach(() => {
    mediator = {
      execute: jasmine.createSpy('execute'),
    };
    frameCallback = null;

    configureDiTest({
      providers: [ScheduleAutoPanFrame, valueProvider(FMediator, mediator as unknown as FMediator)],
    });

    execution = injectFromDi(ScheduleAutoPanFrame);
    dragContext = injectFromDi(FDraggableDataContext);
    store = injectFromDi(FComponentsStore);

    const flowHost = document.createElement('div');
    spyOn(flowHost, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 0, 400, 300));

    store.fFlow = flowFactory().host(flowHost).build();
    store.fCanvas = canvasFactory().build();
    store.fDraggable = createDraggableStub() as unknown as FDraggableBase;
    store.instances.add(INSTANCES.AUTO_PAN, createAutoPanStub() as FAutoPanBase);

    spyOn(window, 'requestAnimationFrame').and.callFake((callback: FrameRequestCallback) => {
      frameCallback = callback;

      return 7;
    });
  });

  it('should schedule an animation frame for supported drag kinds near the edge', () => {
    dragContext.draggableItems = [createHandlerStub('drag-node')];
    dragContext.lastPointerPosition = { x: 395, y: 60 };

    execution.handle(new ScheduleAutoPanFrameRequest());

    expect(dragContext.autoPanFrameId).toBe(7);

    runFrame(frameCallback);

    expect(dragContext.autoPanFrameId).toBeNull();
    expect(mediator.execute).toHaveBeenCalledWith(jasmine.any(RunAutoPanFrameRequest));
  });

  it('should stop auto-pan instead of scheduling a frame when pointer leaves the edge zone', () => {
    dragContext.draggableItems = [createHandlerStub('drag-node')];
    dragContext.lastPointerPosition = { x: 200, y: 60 };

    execution.handle(new ScheduleAutoPanFrameRequest());

    expect(window.requestAnimationFrame).not.toHaveBeenCalled();
    expect(mediator.execute).toHaveBeenCalledWith(jasmine.any(StopAutoPanRequest));
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

function createHandlerStub(kind: string): DragHandlerBase<unknown> {
  return {
    getEvent: () => ({ kind, fEventType: kind }),
    onPointerMove: () => {
      // no-op
    },
  } as unknown as DragHandlerBase<unknown>;
}

function runFrame(callback: FrameRequestCallback | null): void {
  if (!callback) {
    throw new Error('requestAnimationFrame callback was not scheduled');
  }

  callback(16);
}
