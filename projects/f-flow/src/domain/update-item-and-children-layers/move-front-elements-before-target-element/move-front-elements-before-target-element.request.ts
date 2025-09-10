export class MoveFrontElementsBeforeTargetElementRequest {
  static readonly fToken = Symbol('MoveFrontElementsBeforeTargetElementRequest');
  constructor(
    public fItemsContainer: HTMLElement, // fGroupsContainer || fNodesContainer || fConnectionsContainer
    public allElements: Element[],
    public elementsThatShouldBeInFront: Element[],
    public targetIndex: number,
  ) {
  }
}
