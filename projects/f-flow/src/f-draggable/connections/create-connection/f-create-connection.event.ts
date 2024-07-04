import { IPoint } from '@foblex/core';

export class FCreateConnectionEvent {

  constructor(
    public fOutputId: string,
    public fInputId: string | undefined,
    public fDropPosition: IPoint,
  ) {
  }
}
