import {inject, Injectable, Injector} from '@angular/core';
import {FExecutionRegister, FMediator, IExecution} from '@foblex/mediator';
import {BuildDragHierarchyRequest} from "./build-drag-hierarchy-request";
import {MoveNodeOrGroupDragHandler} from "../../move-node-or-group.drag-handler";
import {BuildDragHierarchyResponse} from "./build-drag-hierarchy-response";
import {FNodeBase} from "../../../../f-node";
import {GetNormalizedElementRectRequest} from "../../../../domain";
import {IRect} from "@foblex/2d";

@Injectable()
@FExecutionRegister(BuildDragHierarchyRequest)
export class BuildDragHierarchy
  implements IExecution<BuildDragHierarchyRequest, BuildDragHierarchyResponse> {

  private readonly _injector = inject(Injector);
  private readonly _mediator = inject(FMediator);

  public handle({selectedNodesAndGroupsWithChildren}: BuildDragHierarchyRequest): BuildDragHierarchyResponse {
    const byId = this._createHandlersMap(selectedNodesAndGroupsWithChildren);
    const roots = this._linkParentsAndCollectRoots(selectedNodesAndGroupsWithChildren, byId);

    return new BuildDragHierarchyResponse(roots, Array.from(byId.values()));
  }

  private _createHandlersMap(
    selectedNodesAndGroupsWithChildren: FNodeBase[]
  ): Map<string, MoveNodeOrGroupDragHandler> {
    const byId = new Map<string, MoveNodeOrGroupDragHandler>();
    for (const item of selectedNodesAndGroupsWithChildren) {
      const rect = this._mediator.execute<IRect>(new GetNormalizedElementRectRequest(item.hostElement));
      byId.set(item.fId(), new MoveNodeOrGroupDragHandler(this._injector, rect, item));
    }
    return byId;
  }

  private _linkParentsAndCollectRoots(
    selectedNodesAndGroupsWithChildren: FNodeBase[],
    byId: Map<string, MoveNodeOrGroupDragHandler>
  ): MoveNodeOrGroupDragHandler[] {
    const roots: MoveNodeOrGroupDragHandler[] = [];

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
