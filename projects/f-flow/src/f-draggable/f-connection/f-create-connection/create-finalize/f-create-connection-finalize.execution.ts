import { IHandler } from '@foblex/mediator';
import { inject, Injectable } from '@angular/core';
import { FComponentsStore } from '../../../../f-storage';
import { FConnectorBase, FNodeOutletBase, FNodeOutputBase, isNodeOutlet } from '../../../../f-connectors';
import { FCreateConnectionFinalizeRequest } from './f-create-connection-finalize.request';
import { FExecutionRegister, FMediator } from '@foblex/mediator';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { GetFirstConnectableOutputRequest } from '../get-first-connectable-output';
import { FCreateConnectionEvent } from '../f-create-connection.event';
import { FCreateConnectionDragHandler } from '../f-create-connection.drag-handler';
import { FindInputAtPositionRequest } from '../../../../domain';
import { FDragHandlerResult } from '../../../f-drag-handler';
import { IFCreateConnectionDragResult } from '../i-f-create-connection-drag-result';
import {IPointerEvent} from "../../../../drag-toolkit";

@Injectable()
@FExecutionRegister(FCreateConnectionFinalizeRequest)
export class FCreateConnectionFinalizeExecution
  implements IHandler<FCreateConnectionFinalizeRequest, void> {

  private _fResult: FDragHandlerResult<IFCreateConnectionDragResult> = inject(FDragHandlerResult);

  private _fMediator = inject(FMediator);
  private _fComponentsStore = inject(FComponentsStore);
  private _fDraggableDataContext = inject(FDraggableDataContext);

  private get _fDragHandler(): FCreateConnectionDragHandler {
    return this._fDraggableDataContext.draggableItems[ 0 ] as FCreateConnectionDragHandler;
  }

  public handle(request: FCreateConnectionFinalizeRequest): void {
    if (!this._isValid()) {
      return;
    }
    this.emitEvent(request.event);
    this._fDragHandler.onPointerUp();
  }

  private _isValid(): boolean {
    return this._fDraggableDataContext.draggableItems.some(
      (x) => x instanceof FCreateConnectionDragHandler
    );
  }

  private getTargetOutput(output: FConnectorBase | undefined): FConnectorBase {
    if (!output) {
      throw new Error(`Output with fOutputId ${ this._fResult.getData().fOutputId } not found. Make sure there is no f-connection to a non-existent fOutput.`);
    }
    return isNodeOutlet(output.hostElement) ? this._fMediator.execute<FNodeOutputBase>(
      new GetFirstConnectableOutputRequest(output as FNodeOutletBase)
    ) : output;
  }

  private getOutput(): FConnectorBase | undefined {
    return this._fComponentsStore.fOutputs.find((x) => x.fId === this._fResult.getData().fOutputId);
  }

  private getOutlet(): FConnectorBase | undefined {
    return this._fComponentsStore.fOutlets.find((x) => x.fId === this._fResult.getData().fOutputId);
  }

  private emitEvent(event: IPointerEvent): void {
    this._fComponentsStore.fDraggable?.fCreateConnection.emit(
      new FCreateConnectionEvent(
        this.getTargetOutput(this.getOutput() || this.getOutlet()).fId,
        this._getInputUnderPointer(event)?.fId,
        event.getPosition()
      )
    );
  }

  private _getInputUnderPointer(event: IPointerEvent): FConnectorBase | undefined {
    return this._fMediator.execute<FConnectorBase | undefined>(
      new FindInputAtPositionRequest(
        event.getPosition(),
        this._fResult.getData().toConnectorRect,
        this._fResult.getData().canBeConnectedInputs
      )
    );
  }
}
