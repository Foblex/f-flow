export class SortItemsByParentRequest {
  static readonly fToken = Symbol('SortItemsByParentRequest');

  constructor(
    public readonly itemsContainer: HTMLElement, // fGroupsContainer || fNodesContainer
  ) {}
}
