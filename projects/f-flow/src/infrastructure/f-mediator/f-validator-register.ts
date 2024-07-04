import { Type } from '@angular/core';
import { FFlowMediator } from './f-flow-mediator';
import { IValidator } from '../pipeline';

type Constructor<T = any> = new (...args: any[]) => T;

export function FValidatorRegister<TRequest, TResponse>(requestType: Type<TRequest>) {
  return function (constructor: Constructor<IValidator<TRequest>>) {
    FFlowMediator.registerPipeline(requestType, constructor, true);
  };
}
