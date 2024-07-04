import { Injectable } from '@angular/core';
import { ReassignConnectionPreparationRequest } from './reassign-connection-preparation.request';
import { FValidatorRegister, IValidator } from '../../../../infrastructure';
import { FDraggableDataContext } from '../../../f-draggable-data-context';
import { F_CONNECTION_DRAG_HANDLE_CLASS, FConnectionBase } from '../../../../f-connection';
import { FComponentsStore } from '../../../../f-storage';
import { IPoint } from '@foblex/core';

@Injectable()
@FValidatorRegister(ReassignConnectionPreparationRequest)
export class ReassignConnectionPreparationValidator implements IValidator<ReassignConnectionPreparationRequest> {

  private get fConnections(): FConnectionBase[] {
    return this.fComponentsStore.fConnections;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: ReassignConnectionPreparationRequest): boolean {
    return !!this.getDragHandleElements(request.event.getPosition()).length
      && !this.fDraggableDataContext.draggableItems.length;
  }

  private getDragHandleElements(position: IPoint): HTMLElement[] {
    return this.getElementsFromPoint(position).filter((x) => {
      return !!this.getConnectionHandler(x as HTMLElement) && x.classList.contains(F_CONNECTION_DRAG_HANDLE_CLASS);
    });
  }

  private getElementsFromPoint(position: IPoint): HTMLElement[] {
    return document.elementsFromPoint(position.x, position.y) as HTMLElement[];
  }

  public getConnectionHandler(element: HTMLElement | SVGElement): FConnectionBase | undefined {
    return this.fConnections.find(c => c.isContains(element));
  }
}
