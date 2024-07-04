import { IHandler } from '@foblex/core';
import { IValidator } from './i-validator';
import { IExecution } from './i-execution';
import { Injector, Type } from '@angular/core';

export class Pipeline<TRequest, TResponse>
  implements IHandler<TRequest, TResponse | void> {

  private validator?: Type<IValidator<TRequest>>;
  private execution!: Type<IExecution<TRequest, TResponse>>;


  public handle(request: TRequest, injector: Injector): TResponse | void {
    let isValid: boolean = true;
    if (this.validator) {
      isValid = injector.get(this.validator).handle(request);
    }

    if (!isValid) {
      return;
    }
    return injector.get(this.execution).handle(request);
  }

  public setValidator(validator: Type<IValidator<TRequest>>): void {
    this.validator = validator;
  }

  public setExecution(execution: Type<IExecution<TRequest, TResponse>>): void {
    this.execution = execution;
  }
}
