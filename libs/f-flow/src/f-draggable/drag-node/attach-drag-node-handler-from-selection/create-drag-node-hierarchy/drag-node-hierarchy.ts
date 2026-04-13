import { DragNodeItemHandler } from '../../drag-node-handler';

export class DragNodeHierarchy {
  constructor(
    public readonly rootHandlers: DragNodeItemHandler[],
    public readonly participants: DragNodeItemHandler[],
  ) {}
}
