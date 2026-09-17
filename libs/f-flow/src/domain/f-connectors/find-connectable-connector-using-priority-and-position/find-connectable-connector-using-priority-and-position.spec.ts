import { RectExtensions, RoundedRect } from '@foblex/2d';
import { BrowserService } from '@foblex/platform';
import {
  CalculateClosestConnector,
  canvasFactory,
  configureDiTest,
  connectorFactory,
  createMediatorHarness,
  FComponentsStore,
  FConnectorBase,
  FindConnectableConnectorUsingPriorityAndPosition,
  FindConnectableConnectorUsingPriorityAndPositionRequest,
  flowFactory,
  IConnectorRectRef,
  MediatorHarness,
  nodeFactory,
  valueProvider,
} from '@foblex/flow';

describe('FindConnectableConnectorUsingPriorityAndPosition', () => {
  let mediator: MediatorHarness;
  let store: FComponentsStore;
  let host: HTMLElement;
  let nodeElement: HTMLElement;

  function connectorRef(id: string, x: number, y: number): IConnectorRectRef {
    return {
      connector: connectorFactory().id(id).nodeId('node-2').build(),
      rect: RoundedRect.fromRect(RectExtensions.initialize(x, y, 12, 12)),
    };
  }

  beforeEach(() => {
    store = new FComponentsStore();
    store.fCanvas = canvasFactory().build();

    host = document.createElement('div');
    host.style.cssText = 'position:fixed;left:0;top:0;width:400px;height:300px;';
    document.body.appendChild(host);
    store.fFlow = flowFactory().host(host).build();

    nodeElement = document.createElement('div');
    nodeElement.style.cssText = 'position:absolute;left:100px;top:100px;width:120px;height:80px;';
    host.appendChild(nodeElement);

    store.nodes.add(nodeFactory().id('node-2').host(nodeElement).build());

    configureDiTest({
      providers: [
        FindConnectableConnectorUsingPriorityAndPosition,
        CalculateClosestConnector,
        valueProvider(FComponentsStore, store),
        valueProvider(BrowserService, {
          document,
          isBrowser: () => true,
        } as BrowserService),
      ],
    });
    mediator = createMediatorHarness();
  });

  afterEach(() => {
    host.remove();
  });

  it('returns the connector whose rect contains the pointer', () => {
    const top = connectorRef('top', 154, 94);
    const left = connectorRef('left', 94, 134);

    const result = mediator.execute<FConnectorBase | undefined>(
      new FindConnectableConnectorUsingPriorityAndPositionRequest({ x: 100, y: 140 }, [top, left]),
    );

    expect(result?.fId()).toBe('left');
  });

  it('picks the node connector closest to the drop point, not the first registered one (issue #326)', () => {
    const top = connectorRef('top', 154, 94);
    const left = connectorRef('left', 94, 134);

    const result = mediator.execute<FConnectorBase | undefined>(
      // Pointer on the node body, a few pixels away from the left connector rect.
      new FindConnectableConnectorUsingPriorityAndPositionRequest({ x: 115, y: 141 }, [top, left]),
    );

    expect(result?.fId()).toBe('left');
  });

  it('still resolves zero-size connectors through the node fallback (issue #326 repro styling)', () => {
    const top: IConnectorRectRef = {
      connector: connectorFactory().id('top').nodeId('node-2').build(),
      rect: RoundedRect.fromRect(RectExtensions.initialize(160, 100, 0, 0)),
    };
    const left: IConnectorRectRef = {
      connector: connectorFactory().id('left').nodeId('node-2').build(),
      rect: RoundedRect.fromRect(RectExtensions.initialize(100, 140, 0, 0)),
    };

    const result = mediator.execute<FConnectorBase | undefined>(
      new FindConnectableConnectorUsingPriorityAndPositionRequest({ x: 103, y: 142 }, [top, left]),
    );

    expect(result?.fId()).toBe('left');
  });

  it('returns undefined when the pointer is outside every connector and node', () => {
    const top = connectorRef('top', 154, 94);

    const result = mediator.execute<FConnectorBase | undefined>(
      new FindConnectableConnectorUsingPriorityAndPositionRequest({ x: 380, y: 20 }, [top]),
    );

    expect(result).toBeUndefined();
  });
});
