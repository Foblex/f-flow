export class MoveFrontElementsBeforeTargetElementRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('MoveFrontElementsBeforeTargetElementRequest');
  constructor(
    public readonly fItemsContainer: HTMLElement, // fGroupsContainer || fNodesContainer || fConnectionsContainer
    public readonly allElements: Element[],
    public readonly elementsThatShouldBeInFront: Element[],
    public readonly targetIndex: number,
  ) {}
}
