import { inject, Injectable } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { UpdateNodeWhenStateOrSizeChangedRequest } from './update-node-when-state-or-size-changed-request';
import { merge, Observable } from 'rxjs';
import { debounceTime, startWith } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  CalculateConnectorConnectableSideHandler,
  CalculateConnectorConnectableSideRequest,
  FConnectorBase
} from '../../../f-connectors';
import { ComponentDataChangedRequest } from '../../../f-storage';

@Injectable()
@FExecutionRegister(UpdateNodeWhenStateOrSizeChangedRequest)
export class UpdateNodeWhenStateOrSizeChangedExecution implements IExecution<UpdateNodeWhenStateOrSizeChangedRequest, void> {

  private _fMediator = inject(FMediator);

  public handle(request: UpdateNodeWhenStateOrSizeChangedRequest): void {
    const { hostElement, connectors, stateChanges } = request.fComponent;

    merge(new FResizeObserver(hostElement), stateChanges).pipe(
      debounceTime(10), startWith(null), takeUntilDestroyed(request.destroyRef)
    ).subscribe(() => {
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

class FResizeObserver extends Observable<ResizeObserverEntry[]> {

  constructor(element: HTMLElement) {
    super(subscriber => {
      const observer = new ResizeObserver(entries => {
        subscriber.next(entries);
      });

      observer.observe(element);

      return function unsubscribe() {
        observer.unobserve(element);
        observer.disconnect();
      }
    });
  }
}
