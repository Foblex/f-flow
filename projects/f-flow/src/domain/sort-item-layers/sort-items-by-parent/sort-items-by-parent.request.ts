export class SortItemsByParentRequest {
  static readonly fToken = Symbol('SortItemsByParentRequest');

  constructor(
    public fItemsContainer: HTMLElement, // fGroupsContainer || fNodesContainer
  ) {
  }
}
