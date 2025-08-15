import {inject, Injectable} from '@angular/core';
import {FExecutionRegister, FMediator, IExecution} from '@foblex/mediator';
import {IPoint, IRect, PointExtensions} from "@foblex/2d";
import {CalculateDragLimitsRequest} from "./calculate-drag-limits-request";
import {infinityMinMax} from "../../../../../utils";
import {INodeMoveLimits} from "../../i-node-move-limits";
import {FNodeBase} from "../../../../../f-node";
import {GetNormalizedElementRectRequest} from "../../../../../domain";
import {GetNormalizedParentNodeRectRequest} from "../../../../domain";

@Injectable()
@FExecutionRegister(CalculateDragLimitsRequest)
export class CalculateDragLimits
  implements IExecution<CalculateDragLimitsRequest, INodeMoveLimits> {

  private readonly _mediator = inject(FMediator);

  public handle({nodeOrGroup}: CalculateDragLimitsRequest): INodeMoveLimits {
    if (!nodeOrGroup.fParentId()) {
      return {...infinityMinMax()};
    }

    return this._calculateDifference(
      this._getParentRect(nodeOrGroup), this._getCurrentRect(nodeOrGroup)
    );
  }

  private _getCurrentRect(nodeOrGroup: FNodeBase): IRect {
    return this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
  }

  private _getParentRect(nodeOrGroup: FNodeBase): IRect {
    return this._mediator.execute<IRect>(new GetNormalizedParentNodeRectRequest(nodeOrGroup));
  }

  private _calculateDifference(parentRect: IRect, currentRect: IRect): INodeMoveLimits {
    return {
      min: this._calculateMinimumDifference(parentRect, currentRect),
      max: this._calculateMaximumDifference(parentRect, currentRect)
    };
  }

  private _calculateMinimumDifference(parentRect: IRect, currentRect: IRect): IPoint {
    return PointExtensions.initialize(parentRect.x - currentRect.x, parentRect.y - currentRect.y);
  }

  private _calculateMaximumDifference(parentRect: IRect, currentRect: IRect): IPoint {
    return PointExtensions.initialize(
      (parentRect.x + parentRect.width) - (currentRect.x + currentRect.width),
      (parentRect.y + parentRect.height) - (currentRect.y + currentRect.height),
    );
  }
}
