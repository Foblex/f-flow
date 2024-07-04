import { Injectable } from '@angular/core';
import { NodeMoveFinalizeRequest } from './node-move-finalize.request';
import { IPoint, Point } from '@foblex/core';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../../infrastructure';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  IsConnectionUnderNodeRequest
} from '../../../domain/is-connection-under-node/is-connection-under-node.request';

@Injectable()
@FExecutionRegister(NodeMoveFinalizeRequest)
export class NodeMoveFinalizeExecution implements IExecution<NodeMoveFinalizeRequest, void> {

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FFlowMediator
  ) {
  }

  public handle(request: NodeMoveFinalizeRequest): void {
    const difference = this.getDifferenceWithLineAlignment(
      this.getDifferenceBetweenPreparationAndFinalize(request.event.getPosition())
    );
    this.fDraggableDataContext.draggableItems.forEach((x) => {
      x.move(difference);
      x.complete?.();
    });
    this.fMediator.send(new IsConnectionUnderNodeRequest());
    this.fDraggableDataContext.fLineAlignment?.complete();
  }

  private getDifferenceBetweenPreparationAndFinalize(position: IPoint): Point {
    return Point.fromPoint(position).elementTransform(this.flowHost)
      .div(this.fDraggableDataContext.onPointerDownScale).sub(this.fDraggableDataContext.onPointerDownPosition);
  }

  private getDifferenceWithLineAlignment(difference: IPoint): IPoint {
    const intersection = this.fDraggableDataContext.fLineAlignment?.findNearestCoordinate(difference);
    if (intersection) {
      difference.x = intersection.xResult.value ? (difference.x - intersection.xResult.distance!) : difference.x;
      difference.y = intersection.yResult.value ? (difference.y - intersection.yResult.distance!) : difference.y;
    }
    return difference;
  }
}
