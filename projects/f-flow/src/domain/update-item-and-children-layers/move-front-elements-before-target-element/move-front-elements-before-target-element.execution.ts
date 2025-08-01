import { MoveFrontElementsBeforeTargetElementRequest } from './move-front-elements-before-target-element.request';
import { Injectable } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';

/**
 * Execution that moves elements in the FItemsContainer before a target element.
 * It removes elements that should not be in front and inserts them before the target element.
 */
@Injectable()
@FExecutionRegister(MoveFrontElementsBeforeTargetElementRequest)
export class MoveFrontElementsBeforeTargetElementExecution implements IExecution<MoveFrontElementsBeforeTargetElementRequest, void> {

  public handle(request: MoveFrontElementsBeforeTargetElementRequest): void {
    const elementsToMove: Element[] = [];
    for (let i = request.targetIndex + 1; i < request.allElements.length; i++) {
      const element = request.allElements[ i ];
      if (!request.elementsThatShouldBeInFront.includes(element)) {
        elementsToMove.push(element);
      }
    }
    elementsToMove.forEach((x) => {
      request.fItemsContainer.removeChild(x);
      request.fItemsContainer.insertBefore(x, request.allElements[ request.targetIndex ]);
    });
  }
}
