import { MoveDragHandler } from '../../move-drag-handler';

export class DragNodeHierarchy {
  constructor(
    public readonly rootHandlers: MoveDragHandler[],
    public readonly participants: MoveDragHandler[],
  ) {}
}
