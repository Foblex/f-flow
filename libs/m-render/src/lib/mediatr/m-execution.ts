import { IExecution } from './i-execution';
import { Mediatr } from './mediatr';
import { Type } from '@angular/core';

type Constructor<T = any> = new (...args: any[]) => T;

export function MExecution<TRequest, TResponse>(requestType: Type<TRequest>) {
  return function (constructor: Constructor<IExecution<TRequest, TResponse>>) {
    Mediatr.register(requestType, constructor);
  };
}
