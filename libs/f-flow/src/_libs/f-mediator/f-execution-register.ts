import { Type } from '@angular/core';
import { FMediator } from './f-mediator';
import { IExecution } from './i-execution';

export function FExecutionRegister<TRequest, TResponse>(requestType: Type<TRequest>) {
  return function (constructor: Type<IExecution<TRequest, TResponse>>): void {
    FMediator.registerPipeline(requestType, constructor, false);
  };
}
