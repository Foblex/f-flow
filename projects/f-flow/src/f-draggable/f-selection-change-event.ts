import { ICurrentSelection } from '../domain';

export class FSelectionChangeEvent implements ICurrentSelection {

  constructor(
    public fNodeIds: string[],
    public fGroupIds: string[],
    public fConnectionIds: string[],
  ) {
  }
}
