import { ICanChangeSelection } from '../../mixins';

export class UpdateItemAndChildrenLayersRequest {

  constructor(
    public item: ICanChangeSelection,
    public itemContainer: HTMLElement,
  ) {
  }
}
