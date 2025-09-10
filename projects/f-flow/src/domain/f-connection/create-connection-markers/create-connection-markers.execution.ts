import { inject, Injectable } from '@angular/core';
import { CreateConnectionMarkersRequest } from './create-connection-markers-request';
import { FConnectionBase, FMarkerBase } from '../../../f-connection';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { BrowserService } from '@foblex/platform';
import { normalizeDomElementId } from '@foblex/utils';
import { FComponentsStore } from '../../../f-storage';

/**
 * Execution that creates connection markers for a given connection.
 */
@Injectable()
@FExecutionRegister(CreateConnectionMarkersRequest)
export class CreateConnectionMarkersExecution implements IExecution<CreateConnectionMarkersRequest, void> {

  private readonly _browser = inject(BrowserService);
  private readonly _store = inject(FComponentsStore);

  public handle(request: CreateConnectionMarkersRequest): void {
    const element: SVGDefsElement = createSVGElement('defs', this._browser);
    const fConnection = request.fConnection;

    this.getMarkers(fConnection).forEach((marker) => {

      const markerElement = this.createMarkerElement(marker, fConnection.fId());

      const clone = marker.hostElement.cloneNode(true) as HTMLElement;
      clone.setAttribute('height', `${marker.height}`);
      clone.setAttribute('width', `${marker.width}`);
      clone.removeAttribute('markerUnits');
      clone.style.display = 'unset';
      markerElement.append(clone);

      element.append(markerElement);
    });
    const defs = fConnection.fDefs();
    if (defs) {
      defs.nativeElement.innerHTML = element.innerHTML;
    }

    this.makeSafariCompatible(fConnection);
  }

  public getMarkers(fConnection: FConnectionBase): FMarkerBase[] {
    return this._store.fMarkers.filter((x) => fConnection.hostElement.contains(x.hostElement));
  }

  // Safari does not support markers on path elements if markers are defined after the path element
  private makeSafariCompatible(fConnection: FConnectionBase): void {
    fConnection.fPath().hostElement.replaceWith(fConnection.fPath().hostElement);
  }

  private createMarkerElement(marker: FMarkerBase, fConnectionId: string): SVGElement {
    const markerElement = createSVGElement('marker', this._browser);

    markerElement.setAttribute('id', normalizeDomElementId(marker.type + '-' + fConnectionId));

    markerElement.setAttribute('markerHeight', `${marker.height}`);
    markerElement.setAttribute('markerWidth', `${marker.width}`);
    markerElement.setAttribute('orient', `${marker.orient}`);
    markerElement.setAttribute('refX', `${marker.refX}`);
    markerElement.setAttribute('refY', `${marker.refY}`);
    markerElement.setAttribute('markerUnits', `${marker.markerUnits}`);

    return markerElement;
  }
}

function createSVGElement<K extends keyof SVGElementTagNameMap>(tag: K, fBrowser: BrowserService): SVGElementTagNameMap[K] {
  return fBrowser.document.createElementNS('http://www.w3.org/2000/svg', tag);
}
