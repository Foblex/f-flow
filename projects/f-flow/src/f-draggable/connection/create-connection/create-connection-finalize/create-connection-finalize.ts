import { IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../../f-storage';
import {
  FConnectorBase,
  FNodeOutletBase,
  FNodeOutputBase,
  isNodeOutlet,
} from '../../../../f-connectors';
import { CreateConnectionFinalizeRequest } from './create-connection-finalize-request';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { ResolveConnectableOutputForOutletRequest } from '../resolve-connectable-output-for-outlet';
import { FCreateConnectionEvent } from '../f-create-connection-event';
import { FCreateConnectionDragHandler } from '../f-create-connection.drag-handler';
import { FDragHandlerResult } from '../../../f-drag-handler';
import { ICreateConnectionDragResult } from '../i-create-connection-drag-result';
import { IPointerEvent } from '../../../../drag-toolkit';
import { FindConnectableConnectorUsingPriorityAndPositionRequest } from '../../../../domain';

@Injectable()
@FExecutionRegister(CreateConnectionFinalizeRequest)
export class CreateConnectionFinalize implements IHandler<CreateConnectionFinalizeRequest, void> {
  private readonly _result: FDragHandlerResult<ICreateConnectionDragResult> =
    inject(FDragHandlerResult);

  private readonly _mediator = inject(FMediator);
  private readonly _store = inject(FComponentsStore);
  private readonly _dragContext = inject(FDraggableDataContext);

  private get _dragHandler(): FCreateConnectionDragHandler {
    return this._dragContext.draggableItems[0] as FCreateConnectionDragHandler;
  }

  public handle(request: CreateConnectionFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    this._emitEvent(request.event);
    this._dragHandler.onPointerUp();
  }

  private _isValid(): boolean {
    return this._dragContext.draggableItems.some((x) => x instanceof FCreateConnectionDragHandler);
  }

  private _getTargetOutput(output: FConnectorBase | undefined): FConnectorBase {
    if (!output) {
      throw new Error(
        `Output with fOutputId ${this._result.getData().fOutputId} not found. Make sure there is no f-connection to a non-existent fOutput.`,
      );
    }

    return isNodeOutlet(output.hostElement)
      ? this._mediator.execute<FNodeOutputBase>(
          new ResolveConnectableOutputForOutletRequest(output as FNodeOutletBase),
        )
      : output;
  }

  private _getOutput(): FConnectorBase | undefined {
    return this._store.fOutputs.find((x) => x.fId() === this._result.getData().fOutputId);
  }

  private _getOutlet(): FConnectorBase | undefined {
    return this._store.fOutlets.find((x) => x.fId() === this._result.getData().fOutputId);
  }

  private _emitEvent(event: IPointerEvent): void {
    this._store.fDraggable?.fCreateConnection.emit(
      new FCreateConnectionEvent(
        this._getTargetOutput(this._getOutput() || this._getOutlet()).fId(),
        this._getInputUnderPointer(event)?.fId(),
        event.getPosition(),
      ),
    );
  }

  private _getInputUnderPointer(event: IPointerEvent): FConnectorBase | undefined {
    return this._mediator.execute<FConnectorBase | undefined>(
      new FindConnectableConnectorUsingPriorityAndPositionRequest(
        event.getPosition(),
        this._result.getData().canBeConnectedInputs,
      ),
    );
  }
}
