import { signal } from '@angular/core';
import { ILine } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import { BrowserService } from '@foblex/platform';
import {
  configureDiTest,
  ConnectionBehaviourBuilder,
  createSpy,
  EFConnectableSide,
  EFConnectionBehavior,
  FConnectionBase,
  FConnectorBase,
  injectFromDi,
  valueProvider,
} from '@foblex/flow';
import { RedrawConnections } from './redraw-connections';

interface RedrawConnectionsPrivate {
  _setupConnectionWithLine(
    connection: FConnectionBase,
    source: FConnectorBase,
    target: FConnectorBase,
    line: ILine,
  ): void;
}

function createConnector(): FConnectorBase {
  return {
    setConnected: createSpy('setConnected'),
  } as unknown as FConnectorBase;
}

function createConnection(
  pathElement: SVGPathElement,
  waypoints: { current: { x: number; y: number }[] },
): FConnectionBase & {
  setLine: jasmine.Spy;
  initialize: jasmine.Spy;
} {
  return {
    fId: signal('connection-1'),
    fBehavior: EFConnectionBehavior.FLOATING,
    fType: 'adaptive-curve',
    fRadius: 16,
    fOffset: 24,
    fPath: () => ({ hostElement: pathElement }),
    fWaypoints: () => ({
      waypoints: () => waypoints.current,
    }),
    getResolvedSides: () => ({
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
    }),
    setLine: createSpy('setLine'),
    initialize: createSpy('initialize'),
    isSelected: () => false,
    markAsSelected: createSpy('markAsSelected'),
  } as unknown as FConnectionBase & { setLine: jasmine.Spy; initialize: jasmine.Spy };
}

describe('RedrawConnections', () => {
  let execution: RedrawConnections;
  let mediator: jasmine.SpyObj<FMediator>;
  let executionPrivate: RedrawConnectionsPrivate;

  beforeEach(() => {
    mediator = jasmine.createSpyObj<FMediator>('FMediator', ['execute']);
    mediator.execute.and.returnValue(false);

    configureDiTest({
      providers: [
        RedrawConnections,
        valueProvider(FMediator, mediator),
        valueProvider(ConnectionBehaviourBuilder, {} as ConnectionBehaviourBuilder),
        valueProvider(BrowserService, {
          document,
          isBrowser: () => true,
        } as BrowserService),
      ],
    });

    execution = injectFromDi(RedrawConnections);
    executionPrivate = execution as unknown as RedrawConnectionsPrivate;
  });

  it('skips repeated connection redraw when the render signature is unchanged', () => {
    const source = createConnector();
    const target = createConnector();
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const waypoints = { current: [] as { x: number; y: number }[] };
    const connection = createConnection(pathElement, waypoints);
    const line: ILine = {
      point1: { x: 10, y: 20 },
      point2: { x: 100, y: 200 },
    };

    executionPrivate._setupConnectionWithLine(connection, source, target, line);
    executionPrivate._setupConnectionWithLine(connection, source, target, line);

    expect(connection.setLine).toHaveBeenCalledTimes(1);
    expect(connection.initialize).toHaveBeenCalledTimes(1);
  });

  it('redraws again when the connection route inputs change', () => {
    const source = createConnector();
    const target = createConnector();
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const waypoints = { current: [] as { x: number; y: number }[] };
    const connection = createConnection(pathElement, waypoints);
    const line: ILine = {
      point1: { x: 10, y: 20 },
      point2: { x: 100, y: 200 },
    };

    executionPrivate._setupConnectionWithLine(connection, source, target, line);

    waypoints.current = [{ x: 50, y: 60 }];

    executionPrivate._setupConnectionWithLine(connection, source, target, line);

    expect(connection.setLine).toHaveBeenCalledTimes(2);
    expect(connection.initialize).toHaveBeenCalledTimes(2);
  });
});
