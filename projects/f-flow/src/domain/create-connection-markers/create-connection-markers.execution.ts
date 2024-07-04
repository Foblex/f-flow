import { DomElementExtensions, sanitizeElementId } from '@foblex/core';
import { Injectable } from '@angular/core';
import { CreateConnectionMarkersRequest } from './create-connection-markers-request';
import { FConnectionBase, FMarkerBase } from '../../f-connection';
import { FExecutionRegister, IExecution } from '../../infrastructure';

@Injectable()
@FExecutionRegister(CreateConnectionMarkersRequest)
export class CreateConnectionMarkersExecution implements IExecution<CreateConnectionMarkersRequest, void> {

  public handle(request: CreateConnectionMarkersRequest): void {
    const element: SVGDefsElement = DomElementExtensions.createSvgElement('defs');
    const fConnection = request.fConnection;

    fConnection.fMarkers.forEach((marker) => {

      const markerElement = this.createMarkerElement(marker, fConnection.fConnectionId);

      const clone = marker.hostElement.cloneNode(true) as HTMLElement;
      clone.setAttribute('height', `${ marker.height }`);
      clone.setAttribute('width', `${ marker.width }`);
      clone.removeAttribute('markerUnits');
      clone.style.display = 'unset';
      markerElement.append(clone);

      element.append(markerElement);
    });

    fConnection.fDefs.nativeElement.innerHTML = element.innerHTML;

    this.makeSafariCompatible(fConnection);
  }

  // Safari does not support markers on path elements if markers are defined after the path element
  private makeSafariCompatible(fConnection: FConnectionBase): void {
    fConnection.fPath.hostElement.replaceWith(fConnection.fPath.hostElement);
  }

  private createMarkerElement(marker: FMarkerBase, fConnectionId: string): SVGElement {
    const markerElement = DomElementExtensions.createSvgElement('marker');

    markerElement.setAttribute('id', sanitizeElementId(marker.type + '-' + fConnectionId));

    markerElement.setAttribute('markerHeight', `${ marker.height }`);
    markerElement.setAttribute('markerWidth', `${ marker.width }`);
    markerElement.setAttribute('orient', `${ marker.orient }`);
    markerElement.setAttribute('refX', `${ marker.refX }`);
    markerElement.setAttribute('refY', `${ marker.refY }`);
    markerElement.setAttribute('markerUnits', `${ marker.markerUnits }`);

    return markerElement;
  }
}
