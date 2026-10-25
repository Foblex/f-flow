import { Type } from '@angular/core';
import { FMediator } from './f-mediator';
import { IExecution } from './i-execution';
import { FResponseOf } from './f-response-of';

export function FExecutionRegister<TRequest>(requestType: Type<TRequest>) {
  return function (constructor: Type<IExecution<TRequest, FResponseOf<TRequest>>>): void {
    FMediator.registerPipeline(requestType, constructor, false);
  };
}
