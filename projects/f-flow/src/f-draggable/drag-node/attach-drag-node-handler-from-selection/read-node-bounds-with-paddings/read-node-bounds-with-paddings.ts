import { inject, Injectable } from '@angular/core';
import { ReadNodeBoundsWithPaddingsRequest } from './read-node-bounds-with-paddings-request';
import { IRect, RectExtensions } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../../f-node';
import { GetNodePaddingRequest, GetNormalizedElementRectRequest } from '../../../../domain';
import { ReadNodeBoundsWithPaddingsResponse } from './read-node-bounds-with-paddings-response';

@Injectable()
@FExecutionRegister(ReadNodeBoundsWithPaddingsRequest)
export class ReadNodeBoundsWithPaddings
  implements IExecution<ReadNodeBoundsWithPaddingsRequest, ReadNodeBoundsWithPaddingsResponse>
{
  private readonly _mediator = inject(FMediator);

  public handle({
    nodeOrGroup,
    childrenPaddings,
  }: ReadNodeBoundsWithPaddingsRequest): ReadNodeBoundsWithPaddingsResponse {
    const boundingRect = this._readBoundingRect(nodeOrGroup);
    const ownPaddings = this._readOwnPaddings(nodeOrGroup, boundingRect);

    const paddings: [number, number, number, number] = [
      ownPaddings[0] + childrenPaddings[0],
      ownPaddings[1] + childrenPaddings[1],
      ownPaddings[2] + childrenPaddings[2],
      ownPaddings[3] + childrenPaddings[3],
    ];

    const innerRect = RectExtensions.initialize(
      boundingRect.x + paddings[0],
      boundingRect.y + paddings[1],
      boundingRect.width - paddings[0] - paddings[2],
      boundingRect.height - paddings[1] - paddings[3],
    );

    return new ReadNodeBoundsWithPaddingsResponse(nodeOrGroup, boundingRect, innerRect, paddings);
  }

  private _readBoundingRect(nodeOrGroup: FNodeBase): IRect {
    return this._mediator.execute<IRect>(
      new GetNormalizedElementRectRequest(nodeOrGroup.hostElement),
    );
  }

  private _readOwnPaddings(nodeOrGroup: FNodeBase, rect: IRect): [number, number, number, number] {
    return this._mediator.execute<[number, number, number, number]>(
      new GetNodePaddingRequest(nodeOrGroup, rect),
    );
  }
}
