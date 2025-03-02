import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { UpdateNodeWhenStateOrSizeChangedRequest } from './update-node-when-state-or-size-changed-request';
import { EFConnectableSide, FConnectorBase } from '../../../f-connectors';
import { NotifyDataChangedRequest } from '../../../f-storage';
import { debounceTime, FChannelHub, notifyOnStart } from '../../../reactivity';
import { FResizeChannel } from '../../../reactivity';
import { RectExtensions } from '@foblex/2d';

@Injectable()
@FExecutionRegister(UpdateNodeWhenStateOrSizeChangedRequest)
export class UpdateNodeWhenStateOrSizeChangedExecution
  implements IExecution<UpdateNodeWhenStateOrSizeChangedRequest, void> {

  private readonly _fMediator = inject(FMediator);

  public handle(request: UpdateNodeWhenStateOrSizeChangedRequest): void {
    const { hostElement, connectors, stateChanges } = request.fComponent;

    new FChannelHub(
      new FResizeChannel(hostElement),
      stateChanges
    ).pipe(notifyOnStart(), debounceTime(10)).listen(request.destroyRef, () => {
      this._calculateConnectorsConnectableSide(connectors, hostElement);
      this._fMediator.execute<void>(new NotifyDataChangedRequest());
    });
  }

  private _calculateConnectorsConnectableSide(fConnectors: FConnectorBase[], fNodeHost: HTMLElement | SVGElement): void {
    fConnectors.forEach((x: FConnectorBase) => {
      x.fConnectableSide = this._calculateConnectorConnectableSide(x, fNodeHost);
    });
  }

  private _calculateConnectorConnectableSide(fConnector: FConnectorBase, fNodeHost: HTMLElement | SVGElement): EFConnectableSide {
    let result: EFConnectableSide | undefined;

    if (fConnector.userFConnectableSide === EFConnectableSide.AUTO) {
      result = this._getSideByDelta(fConnector.hostElement, fNodeHost);
    } else {
      result = fConnector.userFConnectableSide;
    }
    return result;
  }

  private _getSideByDelta(fConnectorHost: HTMLElement | SVGElement, fNodeHost: HTMLElement | SVGElement): EFConnectableSide {
    let result: EFConnectableSide | undefined;

    const childRect = RectExtensions.fromElement(fConnectorHost);
    const parentRect = fNodeHost.getBoundingClientRect();

    const deltaLeft = childRect.gravityCenter.x - parentRect.left;
    const deltaRight = parentRect.right - childRect.gravityCenter.x;
    const deltaTop = childRect.gravityCenter.y - parentRect.top;
    const deltaBottom = parentRect.bottom - childRect.gravityCenter.y;

    const minDelta = Math.min(deltaLeft, deltaRight, deltaTop, deltaBottom);

    if (minDelta === deltaLeft) {
      result = EFConnectableSide.LEFT;
    } else if (minDelta === deltaRight) {
      result = EFConnectableSide.RIGHT;
    } else if (minDelta === deltaTop) {
      result = EFConnectableSide.TOP;
    } else {
      result = EFConnectableSide.BOTTOM;
    }

    return result;
  }
}

