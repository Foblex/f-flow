import { INodeWithRect } from "../../domain";

export class SortContainersForDropByLayerRequest {
  static readonly fToken = Symbol('SortContainersForDropByLayerRequest');

  constructor(
    public containersForDrop: INodeWithRect[],
  ) {
  }
}
