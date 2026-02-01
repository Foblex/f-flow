import { inject, Injectable, Injector } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { CreateDragNodeHierarchyRequest } from './create-drag-node-hierarchy-request';
import { DragNodeHierarchy } from './drag-node-hierarchy';
import { FNodeBase } from '../../../../f-node';
import { DragNodeItemHandler } from '../../drag-node-handler';

@Injectable()
@FExecutionRegister(CreateDragNodeHierarchyRequest)
export class CreateDragNodeHierarchy
  implements IExecution<CreateDragNodeHierarchyRequest, DragNodeHierarchy>
{
  private readonly _injector = inject(Injector);

  public handle({ nodesAndGroups }: CreateDragNodeHierarchyRequest): DragNodeHierarchy {
    const handlerByNodeId = this._createHandlerByNodeId(nodesAndGroups);
    const rootHandlers = this._linkParentsAndCollectRoots(nodesAndGroups, handlerByNodeId);

    return new DragNodeHierarchy(rootHandlers, Array.from(handlerByNodeId.values()));
  }

  private _createHandlerByNodeId(nodesAndGroups: FNodeBase[]): Map<string, DragNodeItemHandler> {
    const result = new Map<string, DragNodeItemHandler>();

    for (const nodeOrGroup of nodesAndGroups) {
      result.set(nodeOrGroup.fId(), new DragNodeItemHandler(this._injector, nodeOrGroup));
    }

    return result;
  }

  private _linkParentsAndCollectRoots(
    nodesAndGroups: FNodeBase[],
    handlerByNodeId: Map<string, DragNodeItemHandler>,
  ): DragNodeItemHandler[] {
    const rootHandlers: DragNodeItemHandler[] = [];

    for (const nodeOrGroup of nodesAndGroups) {
      const handler = handlerByNodeId.get(nodeOrGroup.fId());
      if (!handler) {
        continue;
      }

      const parentId = nodeOrGroup.fParentId();
      const parentHandler = parentId ? handlerByNodeId.get(parentId) : undefined;

      if (parentHandler) {
        parentHandler.children.push(handler);
      } else {
        rootHandlers.push(handler);
      }
    }

    return rootHandlers;
  }
}
