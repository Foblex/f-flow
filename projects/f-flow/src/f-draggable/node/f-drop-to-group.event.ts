import { IPoint } from '@foblex/2d';

export class FDropToGroupEvent {

  constructor(
    public fTargetNode: string,
    public fNodes: string[],
    public fDropPosition: IPoint,
  ) {
  }
}
