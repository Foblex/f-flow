import { Injectable } from '@angular/core';
import { IsArrayHasParentNodeRequest } from './is-array-has-parent-node.request';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { FNodeBase } from '../../../f-node';

@Injectable()
@FExecutionRegister(IsArrayHasParentNodeRequest)
export class IsArrayHasParentNodeExecution
  implements IExecution<IsArrayHasParentNodeRequest, boolean> {

  public handle(request: IsArrayHasParentNodeRequest): boolean {
    return this._isParentNodeInArray(this._getParentNodeIds(request.fParentNodes), request.fDraggedNodes);
  }

  private _getParentNodeIds(fParentNodes: FNodeBase[]): string[] {
    return fParentNodes.map((x) => x.fId());
  }

  private _isParentNodeInArray(parentNodeIds: string[], fDraggedNodes: FNodeBase[]): boolean {
    return fDraggedNodes.some((x) => parentNodeIds.includes(x.fId()));
  }
}


