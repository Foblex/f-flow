import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { UpdateNodeWhenStateOrSizeChangedRequest } from './update-node-when-state-or-size-changed-request';
import {
  CalculateConnectorConnectableSideHandler,
  CalculateConnectorConnectableSideRequest,
  FConnectorBase
} from '../../../f-connectors';
import { ComponentDataChangedRequest } from '../../../f-storage';
import { debounceTime, FChannelHub, notifyOnStart } from '../../../reactivity';
import { FResizeChannel } from '../../../reactivity';

@Injectable()
@FExecutionRegister(UpdateNodeWhenStateOrSizeChangedRequest)
export class UpdateNodeWhenStateOrSizeChangedExecution implements IExecution<UpdateNodeWhenStateOrSizeChangedRequest, void> {

  private _fMediator = inject(FMediator);

  public handle(request: UpdateNodeWhenStateOrSizeChangedRequest): void {
    const { hostElement, connectors, stateChanges } = request.fComponent;

    new FChannelHub(
      new FResizeChannel(hostElement),
      stateChanges
    ).pipe(notifyOnStart(), debounceTime(10)).listen(request.destroyRef, () => {
      this._calculateConnectorsConnectableSide(connectors, hostElement);
      this._fMediator.send<void>(new ComponentDataChangedRequest());
    });
  }

  private _calculateConnectorsConnectableSide(fConnectors: FConnectorBase[], hostElement: HTMLElement): void {
    fConnectors.forEach((fConnector: FConnectorBase) => {
      fConnector.fConnectableSide = new CalculateConnectorConnectableSideHandler().handle(
        new CalculateConnectorConnectableSideRequest(fConnector, hostElement)
      );
    });
  }
}

