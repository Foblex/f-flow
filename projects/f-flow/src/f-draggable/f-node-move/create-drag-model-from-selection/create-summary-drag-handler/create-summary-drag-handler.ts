import {inject, Injectable, Injector} from '@angular/core';
import {FExecutionRegister, FMediator, IExecution} from '@foblex/mediator';

import {IMinMaxPoint, IRect, RectExtensions} from "@foblex/2d";
import {CreateSummaryDragHandlerRequest} from "./create-summary-drag-handler-request";
import {MoveSummaryDragHandler} from "../../move-summary.drag-handler";
import {MoveNodeOrGroupDragHandler} from "../../move-node-or-group.drag-handler";
import {INodeMoveLimitsAndPosition} from "../i-node-move-limits-and-position";
import {FNodeBase} from "../../../../f-node";
import {CalculateDragLimitsRequest, IDragLimits} from "../calculate-drag-limits";
import {CalculateSummaryDragLimitsRequest} from '../calculate-summary-drag-limits';
import {GetNormalizedElementRectRequest} from "../../../../domain";

@Injectable()
@FExecutionRegister(CreateSummaryDragHandlerRequest)
export class CreateSummaryDragHandler
  implements IExecution<CreateSummaryDragHandlerRequest, MoveSummaryDragHandler> {

  private readonly _mediator = inject(FMediator);
  private readonly _injector = inject(Injector);

  public handle({hierarchyRoots}: CreateSummaryDragHandlerRequest): MoveSummaryDragHandler {
    const limits = this._collectNodesMoveLimits(hierarchyRoots);
    const summaryLimits = this._calculateSummaryDragLimits(limits);

    return new MoveSummaryDragHandler(
      this._injector,
      summaryLimits, hierarchyRoots,
      this._calculateSummaryBoundingRect(hierarchyRoots.map((x) => x.nodeOrGroup))
    );
  }

  private _collectNodesMoveLimits(hierarchyRoots: MoveNodeOrGroupDragHandler[]): INodeMoveLimitsAndPosition[] {
    const result: INodeMoveLimitsAndPosition[] = [];
    hierarchyRoots.forEach((dragHandler) => {
      const calculatedLimits = this._calculateDragLimits(dragHandler.nodeOrGroup);
      dragHandler.setLimits(calculatedLimits);
      result.push({position: dragHandler.nodeOrGroup._position, ...calculatedLimits.hard});
    });

    return result;
  }

  private _calculateDragLimits(nodeOrGroup: FNodeBase): IDragLimits {
    return this._mediator.execute<IDragLimits>(new CalculateDragLimitsRequest(nodeOrGroup));
  }

  private _calculateSummaryDragLimits(limits: INodeMoveLimitsAndPosition[]): IMinMaxPoint {
    return this._mediator.execute<IMinMaxPoint>(new CalculateSummaryDragLimitsRequest(limits));
  }

  private _calculateSummaryBoundingRect(nodesAndGroups: FNodeBase[]): IRect {
    return RectExtensions.union(nodesAndGroups.map((x) => {
      return this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(x.hostElement));
    })) || RectExtensions.initialize();
  }
}
