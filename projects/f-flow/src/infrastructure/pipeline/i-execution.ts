import { IHandler } from '@foblex/core';

export interface IExecution<TRequest, TResponse>
  extends IHandler<TRequest, TResponse>{
}
