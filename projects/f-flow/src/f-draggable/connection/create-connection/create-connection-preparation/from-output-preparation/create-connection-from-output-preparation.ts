import { FExecutionRegister, FMediator, IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { CreateConnectionFromOutputPreparationRequest } from './create-connection-from-output-preparation-request';
import { FNodeOutputBase, isNodeOutput } from '../../../../../f-connectors';
import { CreateConnectionCreateDragHandlerRequest } from '../create-drag-handler';
import { FComponentsStore } from '../../../../../f-storage';
import { FNodeBase } from '../../../../../f-node';
import { IPoint } from '@foblex/2d';

@Injectable()
@FExecutionRegister(CreateConnectionFromOutputPreparationRequest)
export class CreateConnectionFromOutputPreparation
  implements IHandler<CreateConnectionFromOutputPreparationRequest, void>
{
  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);

  public handle({ event, node }: CreateConnectionFromOutputPreparationRequest): void {
    if (!isNodeOutput(event.targetElement) || this._hasOutlet(node)) {
      return;
    }

    const output = this._findOutput(event.targetElement);
    if (!output || !output.canBeConnected) {
      return;
    }

    this._startDrag(event.getPosition(), output);
  }

  private _hasOutlet(node: FNodeBase): boolean {
    return this._store.outlets.getAll().some((x) => node.isContains(x.hostElement));
  }

  private _findOutput(target: HTMLElement): FNodeOutputBase | undefined {
    return this._store.outputs.getAll().find((x) => x.hostElement.contains(target));
  }

  private _startDrag(position: IPoint, source: FNodeOutputBase): void {
    this._mediator.execute<void>(new CreateConnectionCreateDragHandlerRequest(position, source));
  }
}
