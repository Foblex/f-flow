import { IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../../f-storage';
import { FConnectorBase, FNodeOutletBase } from '../../../../f-connectors';
import { FNodeBase } from '../../../../f-node';
import { ResolveConnectableOutputForOutletRequest } from './resolve-connectable-output-for-outlet-request';
import { FExecutionRegister } from '@foblex/mediator';

@Injectable()
@FExecutionRegister(ResolveConnectableOutputForOutletRequest)
export class ResolveConnectableOutputForOutlet
  implements IHandler<ResolveConnectableOutputForOutletRequest, FConnectorBase | undefined>
{
  private readonly _store = inject(FComponentsStore);

  public handle({ outlet }: ResolveConnectableOutputForOutletRequest): FConnectorBase | undefined {
    const node = this._findOwnerNode(outlet);
    if (!node) {
      throw new Error('The fOutlet must belong to an fNode');
    }

    const output = this._findFirstConnectableOutputInNode(node);
    if (!output) {
      throw new Error('Outlet requires at least one connectable output in the same node.');
    }

    return output;
  }

  private _findOwnerNode(outlet: FNodeOutletBase): FNodeBase | undefined {
    const host = outlet.hostElement;

    return this._store.nodes.getAll<FNodeBase>().find((n) => n.isContains(host));
  }

  private _findFirstConnectableOutputInNode(node: FNodeBase): FConnectorBase | undefined {
    return this._store.fOutputs.find((x) => node.isContains(x.hostElement) && x.canBeConnected);
  }
}
