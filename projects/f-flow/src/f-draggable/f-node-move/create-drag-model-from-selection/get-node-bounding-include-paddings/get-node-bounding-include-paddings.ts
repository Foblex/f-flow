import {inject, Injectable} from '@angular/core';
import {GetNodeBoundingIncludePaddingsRequest} from './get-node-bounding-include-paddings-request';
import {IRect, RectExtensions} from '@foblex/2d';
import {FExecutionRegister, FMediator, IExecution} from '@foblex/mediator';
import {FNodeBase} from "../../../../f-node";
import {GetNodePaddingRequest, GetNormalizedElementRectRequest} from "../../../../domain";
import {GetNodeBoundingIncludePaddingsResponse} from "./get-node-bounding-include-paddings-response";

@Injectable()
@FExecutionRegister(GetNodeBoundingIncludePaddingsRequest)
export class GetNodeBoundingIncludePaddings
  implements IExecution<GetNodeBoundingIncludePaddingsRequest, GetNodeBoundingIncludePaddingsResponse> {

  private readonly _mediator = inject(FMediator);

  public handle({nodeOrGroup}: GetNodeBoundingIncludePaddingsRequest): GetNodeBoundingIncludePaddingsResponse {
    return this._rect(nodeOrGroup);
  }

  private _rect(nodeOrGroup: FNodeBase): GetNodeBoundingIncludePaddingsResponse {
    const boundingRect = this._boundingRect(nodeOrGroup);
    const padding = this._paddings(nodeOrGroup, boundingRect);
    return new GetNodeBoundingIncludePaddingsResponse(
      nodeOrGroup,
      boundingRect,
      RectExtensions.initialize(
        boundingRect.x + padding[0],
        boundingRect.y + padding[1],
        boundingRect.width - padding[0] - padding[2],
        boundingRect.height - padding[1] - padding[3]
      )
    )
  }

  private _boundingRect(nodeOrGroup: FNodeBase): IRect {
    return this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
  }

  private _paddings(nodeOrGroup: FNodeBase, rect: IRect): [number, number, number, number] {
    return this._mediator.execute<[number, number, number, number]>(new GetNodePaddingRequest(nodeOrGroup, rect));
  }
}
