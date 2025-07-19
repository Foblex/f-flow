import {IPoint} from '@foblex/2d';

export class FMoveNodesEvent {

  constructor(
    public fNodes: { id: string; position: IPoint }[],
  ) {
  }
}
