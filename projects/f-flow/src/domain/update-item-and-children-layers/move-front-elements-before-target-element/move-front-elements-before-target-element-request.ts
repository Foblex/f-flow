export class MoveFrontElementsBeforeTargetElementRequest {
  static readonly fToken = Symbol('MoveFrontElementsBeforeTargetElementRequest');
  constructor(
    public readonly fItemsContainer: HTMLElement, // fGroupsContainer || fNodesContainer || fConnectionsContainer
    public readonly allElements: Element[],
    public readonly elementsThatShouldBeInFront: Element[],
    public readonly targetIndex: number,
  ) {}
}
