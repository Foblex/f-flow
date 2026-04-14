import { signal } from '@angular/core';
import { ILine } from '@foblex/2d';
import { FMediator } from '@foblex/mediator';
import {
  configureDiTest,
  createSpy,
  EFConnectableSide,
  EFConnectionBehavior,
  FConnectionBase,
  injectFromDi,
  valueProvider,
} from '@foblex/flow';
import { ApplyConnectionRender } from './apply-connection-render';
import { ApplyConnectionRenderRequest } from './apply-connection-render-request';

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
    fReassignableStart: () => false,
    fPath: () => ({ hostElement: pathElement }),
    fContents: () => [],
    fWaypoints: () => ({
      waypoints: () => waypoints.current,
    }),
    getResolvedSides: () => ({
      sourceSide: EFConnectableSide.RIGHT,
      targetSide: EFConnectableSide.LEFT,
    }),
    setLine: createSpy('setLine'),
    initialize: createSpy('initialize'),
  } as unknown as FConnectionBase & { setLine: jasmine.Spy; initialize: jasmine.Spy };
}

describe('ApplyConnectionRender', () => {
  let execution: ApplyConnectionRender;
  let mediator: jasmine.SpyObj<FMediator>;

  beforeEach(() => {
    mediator = jasmine.createSpyObj<FMediator>('FMediator', ['execute']);
    mediator.execute.and.returnValue(false);

    configureDiTest({
      providers: [ApplyConnectionRender, valueProvider(FMediator, mediator)],
    });

    execution = injectFromDi(ApplyConnectionRender);
  });

  it('skips repeated render when the render signature is unchanged', () => {
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const waypoints = { current: [] as { x: number; y: number }[] };
    const connection = createConnection(pathElement, waypoints);
    const line: ILine = {
      point1: { x: 10, y: 20 },
      point2: { x: 100, y: 200 },
    };

    execution.handle(new ApplyConnectionRenderRequest(connection, line));
    execution.handle(new ApplyConnectionRenderRequest(connection, line));

    expect(connection.setLine).toHaveBeenCalledTimes(1);
    expect(connection.initialize).toHaveBeenCalledTimes(1);
  });

  it('renders again when the connection route inputs change', () => {
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const waypoints = { current: [] as { x: number; y: number }[] };
    const connection = createConnection(pathElement, waypoints);
    const line: ILine = {
      point1: { x: 10, y: 20 },
      point2: { x: 100, y: 200 },
    };

    execution.handle(new ApplyConnectionRenderRequest(connection, line));

    waypoints.current = [{ x: 50, y: 60 }];

    execution.handle(new ApplyConnectionRenderRequest(connection, line));

    expect(connection.setLine).toHaveBeenCalledTimes(2);
    expect(connection.initialize).toHaveBeenCalledTimes(2);
  });

  it('renders again when markers changed even if the route signature stayed the same', () => {
    mediator.execute.and.returnValue(true);

    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const waypoints = { current: [] as { x: number; y: number }[] };
    const connection = createConnection(pathElement, waypoints);
    const line: ILine = {
      point1: { x: 10, y: 20 },
      point2: { x: 100, y: 200 },
    };

    execution.handle(new ApplyConnectionRenderRequest(connection, line));
    execution.handle(new ApplyConnectionRenderRequest(connection, line));

    expect(connection.setLine).toHaveBeenCalledTimes(2);
    expect(connection.initialize).toHaveBeenCalledTimes(2);
  });
});
