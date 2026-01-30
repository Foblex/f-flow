import { FExecutionRegister, FMediator, IHandler } from '@foblex/mediator';
import { IPoint } from '@foblex/2d';
import { inject, Injectable } from '@angular/core';
import { CreateConnectionFromOutletPreparationRequest } from './create-connection-from-outlet-preparation-request';
import { FComponentsStore } from '../../../../../f-storage';
import { FConnectorBase, FNodeOutletBase, FNodeOutputBase } from '../../../../../f-connectors';
import { ResolveConnectableOutputForOutletRequest } from '../../resolve-connectable-output-for-outlet';
import { CreateConnectionCreateDragHandlerRequest } from '../create-drag-handler';
import { FNodeBase } from '../../../../../f-node';

@Injectable()
@FExecutionRegister(CreateConnectionFromOutletPreparationRequest)
export class CreateConnectionFromOutletPreparation
  implements IHandler<CreateConnectionFromOutletPreparationRequest, void>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  public handle({ event, node }: CreateConnectionFromOutletPreparationRequest): void {
    const outlet = this._findOutlet(node);
    if (!outlet) {
      return;
    }

    outlet.setOutputs(this._getOutputs(node));

    if (!outlet.canBeConnected) {
      return;
    }

    const source = outlet.isConnectionFromOutlet ? outlet : this._resolveOutput(outlet);
    if (!source || !source.canBeConnected) {
      return;
    }

    this._startDrag(event.getPosition(), source);
  }

  private _findOutlet(node: FNodeBase): FNodeOutletBase | undefined {
    return this._store.fOutlets.find((x) => node.isContains(x.hostElement)) as
      | FNodeOutletBase
      | undefined;
  }

  private _getOutputs(node: FNodeBase): FConnectorBase[] {
    return this._store.fOutputs.filter((o) => node.isContains(o.hostElement));
  }

  private _resolveOutput(outlet: FNodeOutletBase): FNodeOutputBase | undefined {
    return this._mediator.execute<FNodeOutputBase | undefined>(
      new ResolveConnectableOutputForOutletRequest(outlet),
    );
  }

  private _startDrag(position: IPoint, source: FNodeOutputBase | FNodeOutletBase): void {
    this._mediator.execute<void>(new CreateConnectionCreateDragHandlerRequest(position, source));
  }
}
