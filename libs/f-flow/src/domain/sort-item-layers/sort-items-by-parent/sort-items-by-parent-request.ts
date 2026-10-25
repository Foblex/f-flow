export class SortItemsByParentRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('SortItemsByParentRequest');

  constructor(
    public readonly itemsContainer: HTMLElement, // fGroupsContainer || fNodesContainer
  ) {}
}
