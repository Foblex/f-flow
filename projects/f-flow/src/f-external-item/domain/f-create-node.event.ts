import { IRect } from '@foblex/core';

export class FCreateNodeEvent<TData = any> {

  constructor(
    public rect: IRect,
    public data: TData,
  ) {
  }
}
