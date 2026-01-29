export class FDragStartedEvent<T = unknown> {
  constructor(
    public readonly fEventType: string,
    public readonly fData?: T,
  ) {}
}
