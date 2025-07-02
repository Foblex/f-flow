import { ISelectable } from '../../mixins';

export class UpdateItemAndChildrenLayersRequest {
  static readonly fToken = Symbol('UpdateItemAndChildrenLayersRequest');

  constructor(
    public item: ISelectable,
    public itemContainer: HTMLElement,
  ) {
  }
}
