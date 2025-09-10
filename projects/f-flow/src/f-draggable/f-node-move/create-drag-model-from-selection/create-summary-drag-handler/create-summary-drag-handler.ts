import { inject, Injectable, Injector } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { CreateSummaryDragHandlerRequest } from "./create-summary-drag-handler-request";
import { MoveSummaryDragHandler } from "../../move-summary-drag-handler";
import { MoveDragHandler } from "../../move-drag-handler";
import { FNodeBase } from "../../../../f-node";
import { CalculateDragLimitsRequest, IDragLimits } from "../calculate-drag-limits";

@Injectable()
@FExecutionRegister(CreateSummaryDragHandlerRequest)
export class CreateSummaryDragHandler
  implements IExecution<CreateSummaryDragHandlerRequest, MoveSummaryDragHandler> {

  private readonly _injector = inject(Injector);
  private readonly _mediator = inject(FMediator);

  public handle({ roots, list }: CreateSummaryDragHandlerRequest): MoveSummaryDragHandler {
    this._setLimitsToTheRootHandlers(roots);

    return new MoveSummaryDragHandler(this._injector, list, roots);
  }

  private _setLimitsToTheRootHandlers(roots: MoveDragHandler[]): void {
    roots.forEach((dragHandler) => {
      dragHandler.setLimits(this._calculateDragLimits(dragHandler.nodeOrGroup));
    });
  }

  private _calculateDragLimits(nodeOrGroup: FNodeBase): IDragLimits {
    return this._mediator.execute<IDragLimits>(new CalculateDragLimitsRequest(nodeOrGroup));
  }
}
