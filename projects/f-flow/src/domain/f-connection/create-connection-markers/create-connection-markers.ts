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
export class CreateConnectionMarkers implements IExecution<CreateConnectionMarkersRequest, void> {
  private readonly _browser = inject(BrowserService);
  private readonly _store = inject(FComponentsStore);

  public handle({ connection }: CreateConnectionMarkersRequest): void {
    const element = createSVGElement('defs', this._browser);

    this._findConnectionMarkers(connection).forEach((marker) => {
      const markerElement = createMarkerElement(marker, connection.fId(), this._browser);

      const clone = marker.hostElement.cloneNode(true) as HTMLElement;
      clone.setAttribute('height', `${marker.height}`);
      clone.setAttribute('width', `${marker.width}`);
      clone.removeAttribute('markerUnits');
      clone.style.display = 'unset';
      markerElement.append(clone);

      element.append(markerElement);
    });

    const defs = connection.fDefs();
    if (defs) {
      defs.nativeElement.innerHTML = element.innerHTML;
    }

    this._makeSafariCompatible(connection);
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
