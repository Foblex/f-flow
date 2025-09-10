import { IPoint } from '@foblex/2d';

export class FReassignConnectionEvent {

  constructor(
    public connectionId: string,
    public isSourceReassign: boolean,
    public isTargetReassign: boolean,
    public oldSourceId: string,
    public newSourceId: string | undefined,
    public oldTargetId: string,
    public newTargetId: string | undefined,
    public dropPoint: IPoint,
  ) {
  }
}
