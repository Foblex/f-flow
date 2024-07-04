import { Type } from '@angular/core';
import { FFlowMediator } from './f-flow-mediator';
import { IExecution } from '../pipeline';

type Constructor<T = any> = new (...args: any[]) => T;

export function FExecutionRegister<TRequest, TResponse>(requestType: Type<TRequest>) {
  return function (constructor: Constructor<IExecution<TRequest, TResponse>>) {
    FFlowMediator.registerPipeline(requestType, constructor, false);
  };
}
