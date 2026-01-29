import { MoveDragHandler } from '../../move-drag-handler';

export class BuildDragHierarchyResponse {
  constructor(
    public readonly dragRoots: MoveDragHandler[],
    public readonly participants: MoveDragHandler[],
  ) {}
}
