import { TransformModelExtensions } from '@foblex/2d';
import { canvasFactory, configureDiTest, FComponentsStore, injectFromDi } from '@foblex/flow';
import { ECanvasRedrawContext } from './e-canvas-redraw-context';
import { RedrawCanvasWithAnimation } from './redraw-canvas-with-animation';
import { RedrawCanvasWithAnimationRequest } from './redraw-canvas-with-animation-request';

describe('RedrawCanvasWithAnimation', () => {
  let execution: RedrawCanvasWithAnimation;
  let emitCanvasChange: jasmine.Spy;
  let store: FComponentsStore;

  beforeEach(() => {
    configureDiTest({ providers: [RedrawCanvasWithAnimation] });

    store = injectFromDi(FComponentsStore);
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

  it('does not start a viewport animation when the transform is unchanged', () => {
    const canvas = store.fCanvas;
    if (!canvas) {
      fail('Expected a canvas in the component store');

      return;
    }
    canvas.hostElement.style.transform = TransformModelExtensions.toString(canvas.transform);
    const redrawSpy = spyOn(canvas, 'redraw');
    const redrawWithAnimationSpy = spyOn(canvas, 'redrawWithAnimation');

    execution.handle(
      new RedrawCanvasWithAnimationRequest(true, ECanvasRedrawContext.VIEWPORT_ONLY, false),
    );

    expect(redrawSpy).toHaveBeenCalledTimes(1);
    expect(redrawWithAnimationSpy).not.toHaveBeenCalled();
    expect(store.isViewportAnimating).toBeFalse();
  });
});
