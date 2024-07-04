export class FReassignConnectionEvent<T = any> {

  constructor(
    public connectionId: T,
    public fOutputId: T,
    public oldFInputId: T,
    public newFInputId: T
  ) {
  }
}
