import { RectExtensions, RoundedRect } from '@foblex/2d';
import {
  CalculateClosestConnector,
  CalculateClosestConnectorRequest,
  connectorFactory,
  configureDiTest,
  createMediatorHarness,
  IClosestConnectorRef,
  MediatorHarness,
} from '@foblex/flow';

describe('CalculateClosestConnector', () => {
  let mediator: MediatorHarness;

  beforeEach(() => {
    configureDiTest({ providers: [CalculateClosestConnector] });
    mediator = createMediatorHarness();
  });

  it('should return undefined when connectors is empty', () => {
    const result = mediator.execute(new CalculateClosestConnectorRequest({ x: 50, y: 50 }, []));

    expect(result).toBeUndefined();
  });

  it('should return the only element if its distance is less than snapThreshold', () => {
    const result = mediator.execute<IClosestConnectorRef>(
      new CalculateClosestConnectorRequest({ x: 10, y: 10 }, [
        {
          connector: connectorFactory().id('input1').build(),
          rect: RoundedRect.fromRect(RectExtensions.initialize(12, 12, 10, 10)),
        },
        {
          connector: connectorFactory().id('input2').build(),
          rect: RoundedRect.fromRect(RectExtensions.initialize(22, 22, 10, 10)),
        },
      ]),
    );

    expect(result).toBeDefined();
    expect(result?.connector.fId()).toBe('input1');
  });

  it('should return 10 if the only element is exactly at snapThreshold distance', () => {
    const result = mediator.execute<IClosestConnectorRef>(
      new CalculateClosestConnectorRequest({ x: 0, y: 0 }, [
        {
          connector: connectorFactory().id('input1').build(),
          rect: RoundedRect.fromRect(RectExtensions.initialize(10, 0, 10, 10)),
        },
        {
          connector: connectorFactory().id('input2').build(),
          rect: RoundedRect.fromRect(RectExtensions.initialize(22, 22, 10, 10)),
        },
      ]),
    );

    expect(result?.distance).toBe(10);
  });
});
