import { IHandler } from '@foblex/core';

export interface IValidator<TRequest>
  extends IHandler<TRequest, boolean>{
}
