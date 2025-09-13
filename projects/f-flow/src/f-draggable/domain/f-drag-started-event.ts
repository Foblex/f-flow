export class FDragStartedEvent {
  constructor(
    public fEventType: string,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public fData?: any,
  ) {}
}
