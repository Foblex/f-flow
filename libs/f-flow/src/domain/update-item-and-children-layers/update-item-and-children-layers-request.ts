import { ISelectable } from '../../mixins';

export class UpdateItemAndChildrenLayersRequest {
  /** Erased marker: the execution's return type, inferred by FMediator.execute. */
  declare readonly __response: void;

  static readonly fToken = Symbol('UpdateItemAndChildrenLayersRequest');

  constructor(
    public item: ISelectable,
    public itemContainer: HTMLElement,
  ) {}
}
