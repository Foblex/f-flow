import { signal } from '@angular/core';
import { BrowserService } from '@foblex/platform';
import { EFMarkerType } from '../../../f-connection-v2/components/connection-marker/enums';
import {
  configureDiTest,
  FConnectionBase,
  FConnectionMarkerBase,
  injectFromDi,
  valueProvider,
} from '@foblex/flow';
import { CreateConnectionMarkers } from './create-connection-markers';
import { CreateConnectionMarkersRequest } from './create-connection-markers-request';

function createMarker(
  id: string,
  markerElement: SVGSVGElement,
  width: number,
): FConnectionMarkerBase {
  return {
    fId: signal(id),
    hostElement: markerElement,
    markerElement,
    width,
    height: 12,
    refX: 12,
    refY: 6,
    type: EFMarkerType.END,
    orient: 'auto',
    markerUnits: 'strokeWidth',
  } as unknown as FConnectionMarkerBase;
}

function createConnection(
  defsElement: SVGDefsElement,
  pathElement: SVGPathElement,
  markers: FConnectionMarkerBase[],
): FConnectionBase {
  return {
    fId: signal('connection-1'),
    hostElement: document.createElement('div'),
    fDefs: () => ({ nativeElement: defsElement }),
    fPath: () => ({ hostElement: pathElement }),
    fMarkers: () => markers,
  } as unknown as FConnectionBase;
}

describe('CreateConnectionMarkers', () => {
  let execution: CreateConnectionMarkers;

  beforeEach(() => {
    configureDiTest({
      providers: [
        CreateConnectionMarkers,
        valueProvider(BrowserService, {
          document,
          isBrowser: () => true,
        } as BrowserService),
      ],
    });

    execution = injectFromDi(CreateConnectionMarkers);
  });

  it('skips rebuilding defs when marker signature is unchanged', () => {
    const markerElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    markerElement.innerHTML = '<path d="M0,0 L12,6 L0,12 z"></path>';

    const defsElement = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    const replaceSpy = spyOn(pathElement, 'replaceWith').and.callFake(() => undefined);

    const marker = createMarker('marker-1', markerElement, 12);
    const connection = createConnection(defsElement, pathElement, [marker]);

    expect(execution.handle(new CreateConnectionMarkersRequest(connection))).toBeTrue();
    expect(defsElement.innerHTML).toContain('marker');
    expect(replaceSpy).toHaveBeenCalledTimes(1);

    expect(execution.handle(new CreateConnectionMarkersRequest(connection))).toBeFalse();
    expect(replaceSpy).toHaveBeenCalledTimes(1);

    marker.width = 16;

    expect(execution.handle(new CreateConnectionMarkersRequest(connection))).toBeTrue();
    expect(replaceSpy).toHaveBeenCalledTimes(2);
  });
});
