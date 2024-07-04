import { Injectable } from '@angular/core';
import { CanvasMovePreparationRequest } from './canvas-move-preparation.request';
import { FValidatorRegister, IValidator } from '../../../infrastructure';
import { FComponentsStore } from '../../../f-storage';
import { FDraggableDataContext } from '../../f-draggable-data-context';
import { FNodeBase } from '../../../f-node';

@Injectable()
@FValidatorRegister(CanvasMovePreparationRequest)
export class CanvasMovePreparationValidator implements IValidator<CanvasMovePreparationRequest> {

  private get flowHost(): HTMLElement {
    return this.fComponentsStore.fFlow!.hostElement;
  }

  constructor(
    private fComponentsStore: FComponentsStore,
    private fDraggableDataContext: FDraggableDataContext
  ) {
  }

  public handle(request: CanvasMovePreparationRequest): boolean {
    return !this.fDraggableDataContext.draggableItems.length &&
      (this.isBackgroundElement(request.event.targetElement) || this.isDragOnHost(request.event.targetElement));
  }

  private isBackgroundElement(targetElement: HTMLElement): boolean | undefined {
    return this.fComponentsStore.fBackground?.isBackgroundElement(targetElement);
  }

  private isDragOnHost(targetElement: HTMLElement): boolean {
    return this.flowHost.contains(targetElement) && !this.getNode(targetElement);
  }

  private getNode(targetElement: HTMLElement): FNodeBase | undefined {
    let result = this.fComponentsStore.findNode(targetElement);
    if (result && result.fDraggingDisabled) {
      result = undefined;
    }
    return result;
  }
}
