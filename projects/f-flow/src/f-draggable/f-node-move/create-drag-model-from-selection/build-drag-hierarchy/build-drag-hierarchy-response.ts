import {MoveNodeOrGroupDragHandler} from "../../move-node-or-group.drag-handler";

export class BuildDragHierarchyResponse {

  constructor(
    public roots: MoveNodeOrGroupDragHandler[],
    public list: MoveNodeOrGroupDragHandler[],
  ) {
  }
}
