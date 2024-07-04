import { Injectable } from '@angular/core';
import { ReassignConnectionPreparationRequest } from './reassign-connection-preparation.request';
import { IPoint, ITransformModel, Point } from '@foblex/core';
import { FComponentsStore } from '../../../../f-storage';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { UpdateItemLayerRequest } from '../../../../domain';
import { FExecutionRegister, FFlowMediator, IExecution } from '../../../../infrastructure';
import { F_CONNECTION_DRAG_HANDLE_CLASS, FConnectionBase } from '../../../../f-connection';
import { ReassignConnectionDragHandler } from '../reassign-connection.drag-handler';

@Injectable()
@FExecutionRegister(ReassignConnectionPreparationRequest)
export class ReassignConnectionPreparationExecution implements IExecution<ReassignConnectionPreparationRequest, void> {

  private get transform(): ITransformModel {
    return this.fComponentsStore.fCanvas!.transform;
  }

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  private get fConnections(): FConnectionBase[] {
    return this.fComponentsStore.fConnections;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext,
    private fMediator: FFlowMediator
  ) {
  }

  public handle(request: ReassignConnectionPreparationRequest): void {
    const connectionToReassign = this.getConnectionHandler(
      this.getDragHandleElement(request.event.getPosition())
    )!;

    this.fMediator.send<void>(
      new UpdateItemLayerRequest(
        connectionToReassign, this.fComponentsStore.fCanvas!.fConnectionsContainer.nativeElement
      )
    );

    this.fDraggableDataContext.onPointerDownScale = this.transform.scale;

    this.fDraggableDataContext.onPointerDownPosition = Point.fromPoint(request.event.getPosition())
      .elementTransform(this.flowHost).div(this.transform.scale);

    this.fDraggableDataContext.draggableItems = [
      new ReassignConnectionDragHandler(this.fMediator, connectionToReassign)
    ];
  }

  private getDragHandleElement(position: IPoint): HTMLElement {
    return this.getElementsFromPoint(position).filter((x) => {
      return !!this.getConnectionHandler(x as HTMLElement) && x.classList.contains(F_CONNECTION_DRAG_HANDLE_CLASS);
    }).find((x) => !!x)!;
  }

  private getElementsFromPoint(position: IPoint): HTMLElement[] {
    return document.elementsFromPoint(position.x, position.y) as HTMLElement[];
  }

  public getConnectionHandler(element: HTMLElement | SVGElement): FConnectionBase | undefined {
    return this.fConnections.find(c => c.isContains(element));
  }
}
