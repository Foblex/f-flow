import { FExecutionRegister, FMediator, IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../../f-storage';
import { isNodeOutlet, isNodeOutput } from '../../../../f-connectors';
import { FNodeBase } from '../../../../f-node';
import { CreateConnectionPreparationRequest } from './create-connection-preparation-request';
import { CreateConnectionFromOutletPreparationRequest } from './from-outlet-preparation';
import { CreateConnectionFromOutputPreparationRequest } from './from-output-preparation';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { FEventTrigger, isValidEventTrigger } from '../../../../domain';
import { IPointerEvent } from '../../../../drag-toolkit';

@Injectable()
@FExecutionRegister(CreateConnectionPreparationRequest)
export class CreateConnectionPreparation
  implements IHandler<CreateConnectionPreparationRequest, void>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  public handle({ event, fTrigger }: CreateConnectionPreparationRequest): void {
    if (!this._isValidConditions() || !this._isValidTrigger(event, fTrigger)) {
      return;
    }

    const isOutlet = isNodeOutlet(event.targetElement);
    const isOutput = !isOutlet && isNodeOutput(event.targetElement);
    if (!isOutlet && !isOutput) {
      return;
    }

    const node = this._findOwnerNode(event.targetElement);
    if (!node) {
      return;
    }

    if (isOutlet) {
      this._mediator.execute<void>(new CreateConnectionFromOutletPreparationRequest(event, node));
    } else {
      this._mediator.execute<void>(new CreateConnectionFromOutputPreparationRequest(event, node));
    }
  }

  private _findOwnerNode(target: HTMLElement | SVGElement): FNodeBase | undefined {
    return this._store.nodes.getAll().find((n) => n.isContains(target));
  }

  private _isValidConditions(): boolean {
    return this._dragContext.isEmpty() && !!this._store.connections.getForCreate();
  }

  private _isValidTrigger(event: IPointerEvent, fTrigger: FEventTrigger): boolean {
    return isValidEventTrigger(event.originalEvent, fTrigger);
  }
}
