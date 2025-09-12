import { inject, Injectable } from '@angular/core';
import { GetNodeBoundingIncludePaddingsRequest } from './get-node-bounding-include-paddings-request';
import { IRect, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FNodeBase } from "../../../../f-node";
import { GetNodePaddingRequest, GetNormalizedElementRectRequest } from "../../../../domain";
import { GetNodeBoundingIncludePaddingsResponse } from "./get-node-bounding-include-paddings-response";

@Injectable()
@FExecutionRegister(GetNodeBoundingIncludePaddingsRequest)
export class GetNodeBoundingIncludePaddings
  implements IExecution<GetNodeBoundingIncludePaddingsRequest, GetNodeBoundingIncludePaddingsResponse> {

  private readonly _mediator = inject(FMediator);

  public handle({ nodeOrGroup, childrenPaddings }: GetNodeBoundingIncludePaddingsRequest): GetNodeBoundingIncludePaddingsResponse {
    return this._rect(nodeOrGroup, childrenPaddings);
  }

  private _rect(nodeOrGroup: FNodeBase, childrenPaddings: [number, number, number, number]): GetNodeBoundingIncludePaddingsResponse {
    const boundingRect = this._boundingRect(nodeOrGroup);
    const paddings = this._paddings(nodeOrGroup, boundingRect);
    paddings[0] += childrenPaddings[0];
    paddings[1] += childrenPaddings[1];
    paddings[2] += childrenPaddings[2];
    paddings[3] += childrenPaddings[3];

    return new GetNodeBoundingIncludePaddingsResponse(
      nodeOrGroup,
      boundingRect,
      RectExtensions.initialize(
        boundingRect.x + paddings[0],
        boundingRect.y + paddings[1],
        boundingRect.width - paddings[0] - paddings[2],
        boundingRect.height - paddings[1] - paddings[3],
      ),
      paddings,
    )
  }

  private _boundingRect(nodeOrGroup: FNodeBase): IRect {
    return this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(nodeOrGroup.hostElement));
  }

  private _paddings(nodeOrGroup: FNodeBase, rect: IRect): [number, number, number, number] {
    return this._mediator.execute<[number, number, number, number]>(new GetNodePaddingRequest(nodeOrGroup, rect));
  }
}
