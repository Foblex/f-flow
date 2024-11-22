import { Injectable } from '@angular/core';
import { NodeMoveFinalizeRequest } from './node-move-finalize.request';
import { IPoint, Point } from '@foblex/2d';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import {
  IsConnectionUnderNodeRequest
} from '../../../domain/is-connection-under-node/is-connection-under-node.request';
import { IDraggableItem } from '../../i-draggable-item';
import { NodeDragToParentDragHandler } from '../node-drag-to-parent.drag-handler';

@Injectable()
@FExecutionRegister(NodeMoveFinalizeRequest)
export class NodeMoveFinalizeExecution implements IExecution<NodeMoveFinalizeRequest, void> {

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FMediator
  ) {
  }

  public handle(request: NodeMoveFinalizeRequest): void {
    const difference = this.getDifferenceWithLineAlignment(
      this.getDifferenceBetweenPreparationAndFinalize(request.event.getPosition())
    );
    this.getItems().forEach((x) => {
      x.move({ ...difference });
      x.complete?.();
    });
    this.fMediator.send(new IsConnectionUnderNodeRequest());
    this.fDraggableDataContext.fLineAlignment?.complete();
  }

  private getItems(): IDraggableItem[] {
    return this.fDraggableDataContext.draggableItems
      .filter((x) => !(x instanceof NodeDragToParentDragHandler));
  }

  private getDifferenceBetweenPreparationAndFinalize(position: IPoint): Point {
    return Point.fromPoint(position).elementTransform(this.flowHost)
      .div(this.fDraggableDataContext.onPointerDownScale)
      .sub(this.fDraggableDataContext.onPointerDownPosition);
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
