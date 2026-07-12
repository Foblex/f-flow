import { canvasFactory, configureDiTest, FComponentsStore, injectFromDi } from '@foblex/flow';
import { ECanvasRedrawContext } from './e-canvas-redraw-context';
import { RedrawCanvasWithAnimation } from './redraw-canvas-with-animation';
import { RedrawCanvasWithAnimationRequest } from './redraw-canvas-with-animation-request';

describe('RedrawCanvasWithAnimation', () => {
  let execution: RedrawCanvasWithAnimation;
  let emitCanvasChange: jasmine.Spy;

  beforeEach(() => {
    configureDiTest({ providers: [RedrawCanvasWithAnimation] });

    const store = injectFromDi(FComponentsStore);
    const canvas = canvasFactory().build();
    emitCanvasChange = jasmine.createSpy('emitCanvasChangeEvent');
    canvas.emitCanvasChangeEvent = emitCanvasChange;
    store.fCanvas = canvas;
    execution = injectFromDi(RedrawCanvasWithAnimation);
  });

  it('emits a canvas change by default', () => {
    execution.handle(
      new RedrawCanvasWithAnimationRequest(false, ECanvasRedrawContext.VIEWPORT_ONLY),
    );

    expect(emitCanvasChange).toHaveBeenCalledTimes(1);
  });

  it('can redraw a programmatic viewport change without emitting it', () => {
    execution.handle(
      new RedrawCanvasWithAnimationRequest(false, ECanvasRedrawContext.VIEWPORT_ONLY, false),
    );

    expect(emitCanvasChange).not.toHaveBeenCalled();
  });
});
