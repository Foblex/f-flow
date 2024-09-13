import { IPoint } from '@foblex/2d';

export class FCreateConnectionEvent {

  constructor(
    public fOutputId: string,
    public fInputId: string | undefined,
    public fDropPosition: IPoint,
  ) {
  }
}
