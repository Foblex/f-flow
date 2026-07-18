import { PointExtensions } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import {
  canvasFactory,
  CenterGroupOrNode,
  CenterGroupOrNodeRequest,
  configureDiTest,
  FComponentsStore,
  flowFactory,
  injectFromDi,
  nodeFactory,
} from '@foblex/flow';

describe('CenterGroupOrNode', () => {
  let execution: CenterGroupOrNode;
  let store: FComponentsStore;

  beforeEach(() => {
    configureDiTest({ providers: [CenterGroupOrNode] });

    execution = injectFromDi(CenterGroupOrNode);
    store = injectFromDi(FComponentsStore);
    spyOn(injectFromDi(FMediator), 'execute');

    const flowHost = document.createElement('div');
    spyOn(flowHost, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 0, 800, 600));
    store.fFlow = flowFactory().host(flowHost).build();

    const canvas = canvasFactory().build();
    canvas.transform.scale = 2;
    canvas.transform.position = PointExtensions.initialize(30, 40);
    canvas.transform.scaledPosition = PointExtensions.initialize(10, 20);
    store.fCanvas = canvas;

    const nodeHost = document.createElement('div');
    spyOn(nodeHost, 'getBoundingClientRect').and.returnValue(new DOMRect(0, 0, 200, 100));
    store.nodes.add(
      nodeFactory()
        .id('target')
        .position(PointExtensions.initialize(300, 150))
        .host(nodeHost)
        .build(),
    );
  });

  it('preserves the current scale by default', () => {
    execution.handle(new CenterGroupOrNodeRequest('target', false));

    expect(store.transform.scale).toBe(2);
    expect(store.transform.position).toEqual(PointExtensions.initialize(-300, -50));
    expect(store.transform.scaledPosition).toEqual(PointExtensions.initialize());
  });

  it('can reset the scale before centering the target', () => {
    execution.handle(new CenterGroupOrNodeRequest('target', false, true, true));

    expect(store.transform.scale).toBe(1);
    expect(store.transform.position).toEqual(PointExtensions.initialize(50, 125));
    expect(store.transform.scaledPosition).toEqual(PointExtensions.initialize());
  });
});
