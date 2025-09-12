import { MoveDragHandler } from "../../move-drag-handler";

export class BuildDragHierarchyResponse {

  constructor(
    public roots: MoveDragHandler[],
    public list: MoveDragHandler[],
  ) {
  }
}
