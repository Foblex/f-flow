import { Type } from '@angular/core';
import { FMediator } from './f-mediator';
import { IValidator } from './i-validator';

export function FValidatorRegister<TRequest>(requestType: Type<TRequest>) {
  return function (constructor: Type<IValidator<TRequest>>): void {
    FMediator.registerPipeline(requestType, constructor, true);
  };
}
