import { FMediator } from '@foblex/mediator';
import { PointExtensions, RectExtensions } from '@foblex/2d';
import {
  canvasFactory,
  configureDiTest,
  FComponentsStore,
  FitToFlow,
  injectFromDi,
  valueProvider,
} from '@foblex/flow';

describe('FitToFlow — fitToParent scale', () => {
  let store: FComponentsStore;
  let execution: FitToFlow;

  beforeEach(() => {
    store = new FComponentsStore();
    store.fCanvas = canvasFactory().build();

    const mediator = jasmine.createSpyObj<FMediator>('FMediator', ['execute']);
    mediator.execute.and.returnValue(undefined);

    configureDiTest({
      providers: [
        FitToFlow,
        valueProvider(FComponentsStore, store),
        valueProvider(FMediator, mediator),
      ],
    });
    execution = injectFromDi(FitToFlow);
  });

  it('magnifies a small bounding box without a cap', () => {
    execution.fitToParent(
      RectExtensions.initialize(0, 0, 100, 50),
      RectExtensions.initialize(0, 0, 1000, 800),
      [PointExtensions.initialize(0, 0)],
      PointExtensions.initialize(),
    );

    expect(store.transform.scale).toBe(10);
  });

  it('clamps the resulting scale to maxScale (issue #147)', () => {
    execution.fitToParent(
      RectExtensions.initialize(0, 0, 100, 50),
      RectExtensions.initialize(0, 0, 1000, 800),
      [PointExtensions.initialize(0, 0)],
      PointExtensions.initialize(),
      1,
    );

    expect(store.transform.scale).toBe(1);
  });

  it('does not touch a scale already below maxScale', () => {
    execution.fitToParent(
      RectExtensions.initialize(0, 0, 2000, 1600),
      RectExtensions.initialize(0, 0, 1000, 800),
      [PointExtensions.initialize(0, 0)],
      PointExtensions.initialize(),
      1,
    );

    expect(store.transform.scale).toBe(0.5);
  });
});
