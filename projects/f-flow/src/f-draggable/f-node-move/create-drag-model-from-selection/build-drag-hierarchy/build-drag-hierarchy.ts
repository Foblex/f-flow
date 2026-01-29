import { inject, Injectable, Injector } from '@angular/core';
import { FExecutionRegister, IExecution } from '@foblex/mediator';
import { BuildDragHierarchyRequest } from './build-drag-hierarchy-request';
import { MoveDragHandler } from '../../move-drag-handler';
import { BuildDragHierarchyResponse } from './build-drag-hierarchy-response';
import { FNodeBase } from '../../../../f-node';

@Injectable()
@FExecutionRegister(BuildDragHierarchyRequest)
export class BuildDragHierarchy
  implements IExecution<BuildDragHierarchyRequest, BuildDragHierarchyResponse>
{
  private readonly _injector = inject(Injector);

  public handle({ items }: BuildDragHierarchyRequest): BuildDragHierarchyResponse {
    const handlersById = this._buildHandlersById(items);
    const roots = this._buildRoots(items, handlersById); // roots are handlers without parents in the selection

    return new BuildDragHierarchyResponse(roots, Array.from(handlersById.values()));
  }

  private _buildHandlersById(items: FNodeBase[]): Map<string, MoveDragHandler> {
    const map = new Map<string, MoveDragHandler>();

    for (const item of items) {
      map.set(item.fId(), new MoveDragHandler(this._injector, item));
    }

    return map;
  }

  private _buildRoots(
    items: FNodeBase[],
    handlersById: Map<string, MoveDragHandler>,
  ): MoveDragHandler[] {
    const roots: MoveDragHandler[] = [];

    for (const item of items) {
      const handler = handlersById.get(item.fId());
      if (!handler) {
        continue;
      }

      const parentId = item.fParentId();
      const parentHandler = parentId ? handlersById.get(parentId) : undefined;

      if (parentHandler) {
        parentHandler.childrenNodeAndGroups.push(handler);
      } else {
        roots.push(handler);
      }
    }

    return roots;
  }
}
