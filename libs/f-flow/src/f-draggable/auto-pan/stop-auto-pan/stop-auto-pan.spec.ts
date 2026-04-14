import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FComponentsStore } from '../../../f-storage';
import { canvasFactory, configureDiTest, injectFromDi } from '../../../testing';
import { StopAutoPan } from './stop-auto-pan';
import { StopAutoPanRequest } from './stop-auto-pan-request';

describe('StopAutoPan', () => {
  let execution: StopAutoPan;
  let dragContext: FDraggableDataContext;
  let store: FComponentsStore;

  beforeEach(() => {
    configureDiTest({
      providers: [StopAutoPan],
    });

    execution = injectFromDi(StopAutoPan);
    dragContext = injectFromDi(FDraggableDataContext);
    store = injectFromDi(FComponentsStore);

    const builtCanvas = canvasFactory().build() as FComponentsStore['fCanvas'] & {
      emitCanvasChangeEvent: jasmine.Spy;
    };
    builtCanvas.emitCanvasChangeEvent = jasmine.createSpy('emitCanvasChangeEvent');
    store.fCanvas = builtCanvas;

    spyOn(window, 'cancelAnimationFrame');
  });

  it('should cancel a pending frame and emit a single canvas change event', () => {
    dragContext.autoPanFrameId = 12;
    dragContext.isAutoPanCanvasMoved = true;

    execution.handle(new StopAutoPanRequest());

    expect(window.cancelAnimationFrame).toHaveBeenCalledWith(12);
    expect(dragContext.autoPanFrameId).toBeNull();
    expect(store.fCanvas?.emitCanvasChangeEvent).toHaveBeenCalledTimes(1);
    expect(dragContext.isAutoPanCanvasMoved).toBeFalse();
  });
});
