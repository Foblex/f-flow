import { FMediator } from '@foblex/mediator';
import {
  canvasFactory,
  configureDiTest,
  FComponentsStore,
  flowFactory,
  injectFromDi,
  valueProvider,
} from '@foblex/flow';
import { GetNormalizedConnectorRect } from './get-normalized-connector-rect';
import { GetNormalizedConnectorRectRequest } from './get-normalized-connector-rect-request';

describe('get-normalized-connector-rect', () => {
  const normalizeCircularBorderRadii = (
    width: number,
    height: number,
    radii: [number, number, number, number],
  ): [number, number, number, number] => {
    const execution = Object.create(
      GetNormalizedConnectorRect.prototype,
    ) as GetNormalizedConnectorRect;

    return execution['_normalizeCircularBorderRadii'](width, height, radii);
  };

  describe('_normalizeCircularBorderRadii', () => {
    it('should keep radii that already fit the rect', () => {
      expect(normalizeCircularBorderRadii(16, 16, [4, 4, 4, 4])).toEqual([4, 4, 4, 4]);
    });

    it('should clamp oversized radii like border-radius 999px on a circle', () => {
      expect(normalizeCircularBorderRadii(16, 16, [999, 999, 999, 999])).toEqual([8, 8, 8, 8]);
    });

    it('should scale all corners proportionally when adjacent sums overflow', () => {
      expect(normalizeCircularBorderRadii(16, 10, [10, 10, 10, 10])).toEqual([5, 5, 5, 5]);
    });
  });

  describe('border-radii caching', () => {
    let store: FComponentsStore;
    let execution: GetNormalizedConnectorRect;
    let element: HTMLElement;

    beforeEach(() => {
      store = new FComponentsStore();
      store.fCanvas = canvasFactory().build();
      const host = document.createElement('div');
      document.body.appendChild(host);
      store.fFlow = flowFactory().host(host).build();

      const mediator = jasmine.createSpyObj<FMediator>('FMediator', ['execute']);
      mediator.execute.and.returnValue(undefined);

      configureDiTest({
        providers: [
          GetNormalizedConnectorRect,
          valueProvider(FComponentsStore, store),
          valueProvider(FMediator, mediator),
        ],
      });

      execution = injectFromDi(GetNormalizedConnectorRect);
      element = document.createElement('div');
      element.style.cssText = 'width:20px;height:20px;border-radius:4px;';
      document.body.appendChild(element);
    });

    afterEach(() => {
      element.remove();
      store.flowHost?.remove();
    });

    it('reads computed styles once per element until the resize signal fires', () => {
      const spy = spyOn(window, 'getComputedStyle').and.callThrough();

      execution.handle(new GetNormalizedConnectorRectRequest(element));
      execution.handle(new GetNormalizedConnectorRectRequest(element));
      expect(spy).toHaveBeenCalledTimes(1);

      store.emitConnectionChanges();
      execution.handle(new GetNormalizedConnectorRectRequest(element));
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('applies the cached radii to the resulting rect', () => {
      const rect = execution.handle(new GetNormalizedConnectorRectRequest(element));

      expect(rect.radius1).toBe(4);
      const again = execution.handle(new GetNormalizedConnectorRectRequest(element));
      expect(again.radius1).toBe(4);
    });
  });
});
