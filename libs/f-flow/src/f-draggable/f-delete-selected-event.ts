/**
 * Event emitted through `(fDeleteSelected)` when the user requests removal of the
 * current selection (keyboard `Delete`/`Backspace` from the accessibility layer).
 * The library never mutates the graph — remove the items from your data and the flow
 * follows.
 */
export class FDeleteSelectedEvent {
  constructor(
    public readonly nodeIds: string[],
    public readonly groupIds: string[],
    public readonly connectionIds: string[],
  ) {}
}
