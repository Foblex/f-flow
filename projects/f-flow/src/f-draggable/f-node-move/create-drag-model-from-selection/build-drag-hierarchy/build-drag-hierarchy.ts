import { inject, Injectable, Injector } from '@angular/core';
import { FExecutionRegister, FMediator, IExecution } from '@foblex/mediator';
import { BuildDragHierarchyRequest } from "./build-drag-hierarchy-request";
import { MoveDragHandler } from "../../move-drag-handler";
import { BuildDragHierarchyResponse } from "./build-drag-hierarchy-response";
import { FNodeBase } from "../../../../f-node";

@Injectable()
@FExecutionRegister(BuildDragHierarchyRequest)
export class BuildDragHierarchy
  implements IExecution<BuildDragHierarchyRequest, BuildDragHierarchyResponse> {

  private readonly _injector = inject(Injector);
  private readonly _mediator = inject(FMediator);

  public handle({ selectedNodesAndGroupsWithChildren }: BuildDragHierarchyRequest): BuildDragHierarchyResponse {
    const byId = this._createHandlersMap(selectedNodesAndGroupsWithChildren);
    const roots = this._linkParentsAndCollectRoots(selectedNodesAndGroupsWithChildren, byId);

    return new BuildDragHierarchyResponse(roots, Array.from(byId.values()));
  }

  private _createHandlersMap(
    selectedNodesAndGroupsWithChildren: FNodeBase[],
  ): Map<string, MoveDragHandler> {
    const byId = new Map<string, MoveDragHandler>();
    for (const item of selectedNodesAndGroupsWithChildren) {
      byId.set(item.fId(), new MoveDragHandler(this._injector, item));
    }

    return byId;
  }

  private _linkParentsAndCollectRoots(
    selectedNodesAndGroupsWithChildren: FNodeBase[],
    byId: Map<string, MoveDragHandler>,
  ): MoveDragHandler[] {
    const roots: MoveDragHandler[] = [];

    for (const item of selectedNodesAndGroupsWithChildren) {
      const handler = byId.get(item.fId())!;
      const parentId = item.fParentId();

      if (parentId && byId.has(parentId)) {
        byId.get(parentId)!.childrenNodeAndGroups.push(handler);
      } else {
        roots.push(handler);
      }
    }

    return roots;
  }
}
