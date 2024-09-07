import { ISelectable } from '../../f-connection';
export class UpdateItemAndChildrenLayersRequest {

  constructor(
    public item: ISelectable,
    public itemContainer: HTMLElement,
  ) {
  }
}
