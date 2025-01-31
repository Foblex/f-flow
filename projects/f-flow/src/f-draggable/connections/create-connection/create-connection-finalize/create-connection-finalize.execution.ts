import { IHandler } from '@foblex/mediator';
import { IPointerEvent } from '@foblex/drag-toolkit';
import { Injectable } from '@angular/core';
import { FComponentsStore } from '../../../../f-storage';
import { FConnectorBase, FNodeOutletBase, FNodeOutputBase, isNodeOutlet } from '../../../../f-connectors';
import { CreateConnectionFinalizeRequest } from './create-connection-finalize.request';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { OutputNotFound } from '../../../../errors';
import { GetCanBeConnectedOutputByOutletRequest } from '../get-can-be-connected-output-by-outlet';
import { FCreateConnectionEvent } from '../f-create-connection.event';
import { CreateConnectionDragHandler } from '../create-connection.drag-handler';
import { FindInputAtPositionRequest } from '../../../../domain';

@Injectable()
@FExecutionRegister(CreateConnectionFinalizeRequest)
export class CreateConnectionFinalizeExecution
  implements IHandler<CreateConnectionFinalizeRequest, void> {

  private get _fDragHandler(): CreateConnectionDragHandler {
    return this.fDraggableDataContext.draggableItems[ 0 ] as CreateConnectionDragHandler;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FMediator,
  ) {
  }

  public handle(request: CreateConnectionFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    this.emitEvent(request.event);
    this._fDragHandler.onPointerUp();
  }

  private _isValid(): boolean {
    return this.fDraggableDataContext.draggableItems.some(
      (x) => x instanceof CreateConnectionDragHandler
    );
  }

  private getTargetOutput(output: FConnectorBase | undefined): FConnectorBase {
    if (!output) {
      throw OutputNotFound(this._getDragHandlerData().fOutputId);
    }
    return isNodeOutlet(output.hostElement) ? this.fMediator.execute<FNodeOutputBase>(
      new GetCanBeConnectedOutputByOutletRequest(output as FNodeOutletBase)
    ) : output;
  }

  private getOutput(): FConnectorBase | undefined {
    return this.fComponentsStore.fOutputs.find((x) => x.fId === this._getDragHandlerData().fOutputId);
  }

  private getOutlet(): FConnectorBase | undefined {
    return this.fComponentsStore.fOutlets.find((x) => x.fId === this._getDragHandlerData().fOutputId);
  }

  private emitEvent(event: IPointerEvent): void {
    this.fComponentsStore.fDraggable?.fCreateConnection.emit(
      new FCreateConnectionEvent(
        this.getTargetOutput(this.getOutput() || this.getOutlet()).fId,
        this._getInputUnderPointer(event)?.fId,
        event.getPosition()
      )
    );
  }

  private _getInputUnderPointer(event: IPointerEvent): FConnectorBase | undefined {
    return this.fMediator.execute<FConnectorBase | undefined>(
      new FindInputAtPositionRequest(
        event.getPosition(),
        this._getDragHandlerData().toConnectorRect,
        this._getDragHandlerData().canBeConnectedInputs
      )
    );
  }

  private _getDragHandlerData() {
    return this._fDragHandler.getData();
  }
}
