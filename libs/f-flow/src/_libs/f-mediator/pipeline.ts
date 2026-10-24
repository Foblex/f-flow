import { IValidator } from './i-validator';
import { IExecution } from './i-execution';
import { Injector, Type } from '@angular/core';
import { IHandler } from './i-handler';

export class Pipeline<TRequest, TResponse> implements IHandler<TRequest, TResponse | void> {
  private _validator?: Type<IValidator<TRequest>>;
  private _execution!: Type<IExecution<TRequest, TResponse>>;

  public handle(request: TRequest, injector: Injector): TResponse | void {
    let isValid = true;
    if (this._validator) {
      isValid = injector.get(this._validator).handle(request);
    }

    if (!isValid) {
      return;
    }

    return injector.get(this._execution).handle(request);
  }

  public execute(request: TRequest, injector: Injector): TResponse | void {
    return injector.get(this._execution).handle(request);
  }

  public setValidator(validator: Type<IValidator<TRequest>>): void {
    this._validator = validator;
  }

  public setExecution(execution: Type<IExecution<TRequest, TResponse>>): void {
    this._execution = execution;
  }
}
