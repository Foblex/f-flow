import { ISelectable } from '../../f-connection';
export class UpdateItemLayerRequest {

  constructor(
    public item: ISelectable,
    public itemContainer: HTMLElement,
  ) {
  }
}
