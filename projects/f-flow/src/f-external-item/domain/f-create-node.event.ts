import { IRect } from '@foblex/2d';

export class FCreateNodeEvent<TData = any> {

  constructor(
    public rect: IRect,
    public data: TData,
  ) {
  }
}
