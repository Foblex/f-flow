import { IPoint } from '@foblex/2d';

export class FDroppedChildrenEvent {

  constructor(
    public fNodes: string[],
    public fDropPosition: IPoint,
  ) {
  }
}
