import { inject, Injectable } from '@angular/core';
import { CreateConnectionMarkersRequest } from './create-connection-markers-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { BrowserService } from '@foblex/platform';
import { normalizeDomElementId } from '@foblex/utils';
import { FConnectionBase, FConnectionMarkerBase } from '../../../f-connection-v2';
import { EFMarkerType } from '../../../f-connection-v2';

/**
 * Execution that creates connection markers for a given connection.
 */
@Injectable()
@FExecutionRegister(CreateConnectionMarkersRequest)
export class CreateConnectionMarkers
  implements IExecution<CreateConnectionMarkersRequest, boolean>
{
  private readonly _browser = inject(BrowserService);
  private readonly _markerCache = new WeakMap<
    FConnectionBase,
    { signature: string; defsElement: SVGDefsElement }
  >();

  public handle({ connection }: CreateConnectionMarkersRequest): boolean {
    const markers = this._findConnectionMarkers(connection);
    const defs = connection.fDefs();
    if (!defs) {
      return false;
    }

    const signature = createConnectionMarkersSignature(markers);
    const cached = this._markerCache.get(connection);
    if (cached?.signature === signature && cached.defsElement === defs.nativeElement) {
      return false;
    }

    const element = createSVGElement('defs', this._browser);

    markers.forEach((marker) => {
      resolveMarkerTypes(marker.type).forEach((type) => {
        const markerElement = createMarkerElement(type, marker, connection.fId(), this._browser);

        const clone = marker.markerElement.cloneNode(true) as SVGElement;
        clone.setAttribute('height', `${marker.height}`);
        clone.setAttribute('width', `${marker.width}`);
        clone.removeAttribute('markerUnits');
        clone.style.display = 'unset';
        markerElement.append(clone);

        element.append(markerElement);
      });
    });

    defs.nativeElement.innerHTML = element.innerHTML;
    this._markerCache.set(connection, {
      signature,
      defsElement: defs.nativeElement,
    });
    this._makeSafariCompatible(connection);

    return true;
  }

  public _findConnectionMarkers(connection: FConnectionBase): FConnectionMarkerBase[] {
    return Array.from(connection.fMarkers() ?? []);
  }

  // Safari does not support markers on path elements if markers are defined after the path element
  private _makeSafariCompatible(fConnection: FConnectionBase): void {
    fConnection.fPath().hostElement.replaceWith(fConnection.fPath().hostElement);
  }
}

function createConnectionMarkersSignature(markers: readonly FConnectionMarkerBase[]): string {
  return markers
    .map((marker) =>
      [
        ...resolveMarkerTypes(marker.type),
        marker.width,
        marker.height,
        marker.refX,
        marker.refY,
        marker.orient,
        marker.markerUnits,
        marker.markerElement.outerHTML,
      ].join('|'),
    )
    .join('||');
}

function createMarkerElement(
  type: string,
  marker: FConnectionMarkerBase,
  connectionId: string,
  browser: BrowserService,
): SVGElement {
  const markerElement = createSVGElement('marker', browser);

  markerElement.setAttribute('id', normalizeDomElementId(type + '-' + connectionId));
  markerElement.setAttribute('markerHeight', `${marker.height}`);
  markerElement.setAttribute('markerWidth', `${marker.width}`);
  markerElement.setAttribute('orient', `${marker.orient}`);
  markerElement.setAttribute('refX', `${marker.refX}`);
  markerElement.setAttribute('refY', `${marker.refY}`);
  markerElement.setAttribute('markerUnits', `${marker.markerUnits}`);

  return markerElement;
}

function resolveMarkerTypes(type: EFMarkerType): string[] {
  switch (type) {
    case EFMarkerType.START:
      return [EFMarkerType.START];

    case EFMarkerType.END:
      return [EFMarkerType.END];

    case EFMarkerType.SELECTED_START:
      return [EFMarkerType.SELECTED_START];

    case EFMarkerType.SELECTED_END:
      return [EFMarkerType.SELECTED_END];

    case EFMarkerType.START_ALL_STATES:
      return [EFMarkerType.START, EFMarkerType.SELECTED_START];

    case EFMarkerType.END_ALL_STATES:
      return [EFMarkerType.END, EFMarkerType.SELECTED_END];

    default:
      return [];
  }
}

function createSVGElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
  fBrowser: BrowserService,
): SVGElementTagNameMap[K] {
  return fBrowser.document.createElementNS('http://www.w3.org/2000/svg', tag);
}
