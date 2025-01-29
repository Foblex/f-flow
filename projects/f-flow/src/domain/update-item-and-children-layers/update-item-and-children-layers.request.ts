import { ISelectable } from '../../mixins';

export class UpdateItemAndChildrenLayersRequest {

  constructor(
    public item: ISelectable,
    public itemContainer: HTMLElement,
  ) {
  }
}
