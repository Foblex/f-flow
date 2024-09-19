export class FReassignConnectionEvent {

  constructor(
    public fConnectionId: string,
    public fOutputId: string,
    public oldFInputId: string,
    public newFInputId: string | undefined
  ) {
  }
}
