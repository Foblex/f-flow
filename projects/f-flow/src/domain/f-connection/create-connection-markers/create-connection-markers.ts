import { inject, Injectable } from '@angular/core';
import { CreateConnectionMarkersRequest } from './create-connection-markers-request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { BrowserService } from '@foblex/platform';
import { normalizeDomElementId } from '@foblex/utils';
import { FComponentsStore } from '../../../f-storage';
import { FConnectionBase, FConnectionMarkerBase } from '../../../f-connection-v2';

/**
 * Execution that creates connection markers for a given connection.
 */
@Injectable()
@FExecutionRegister(CreateConnectionMarkersRequest)
export class CreateConnectionMarkers
  implements IExecution<CreateConnectionMarkersRequest, boolean>
{
  private readonly _browser = inject(BrowserService);
  private readonly _store = inject(FComponentsStore);
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
      const markerElement = createMarkerElement(marker, connection.fId(), this._browser);

      const clone = marker.hostElement.cloneNode(true) as HTMLElement;
      clone.setAttribute('height', `${marker.height}`);
      clone.setAttribute('width', `${marker.width}`);
      clone.removeAttribute('markerUnits');
      clone.style.display = 'unset';
      markerElement.append(clone);

      element.append(markerElement);
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
    return this._store.connectionMarkers
      .getAll()
      .filter((x) => connection.hostElement.contains(x.hostElement));
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
        marker.type,
        marker.width,
        marker.height,
        marker.refX,
        marker.refY,
        marker.orient,
        marker.markerUnits,
        marker.hostElement.outerHTML,
      ].join('|'),
    )
    .join('||');
}

function createMarkerElement(
  marker: FConnectionMarkerBase,
  connectionId: string,
  browser: BrowserService,
): SVGElement {
  const markerElement = createSVGElement('marker', browser);

  markerElement.setAttribute('id', normalizeDomElementId(marker.type + '-' + connectionId));
  markerElement.setAttribute('markerHeight', `${marker.height}`);
  markerElement.setAttribute('markerWidth', `${marker.width}`);
  markerElement.setAttribute('orient', `${marker.orient}`);
  markerElement.setAttribute('refX', `${marker.refX}`);
  markerElement.setAttribute('refY', `${marker.refY}`);
  markerElement.setAttribute('markerUnits', `${marker.markerUnits}`);

  return markerElement;
}

function createSVGElement<K extends keyof SVGElementTagNameMap>(
  tag: K,
  fBrowser: BrowserService,
): SVGElementTagNameMap[K] {
  return fBrowser.document.createElementNS('http://www.w3.org/2000/svg', tag);
}
