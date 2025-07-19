import {IPoint} from '@foblex/2d';

export class FMoveNodesEvent {

  constructor(
    public nodes: { id: string; position: IPoint }[],
  ) {
  }
}
