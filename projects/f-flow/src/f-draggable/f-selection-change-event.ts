import { ICurrentSelection } from '../domain';

export class FSelectionChangeEvent implements ICurrentSelection{

  constructor(
      public nodes: string[],
      public groups: string[],
      public connections: string[],
  ) {
  }
}
