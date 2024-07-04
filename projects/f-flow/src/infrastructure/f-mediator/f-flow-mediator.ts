import { Injectable, Injector, Type } from '@angular/core';
import { IExecution, IValidator, Pipeline } from '../pipeline';

@Injectable()
export class FFlowMediator {

  constructor(
    private injector: Injector,
  ) {
  }

  private static pipelines = new Map<string, Pipeline<any, any>>();

  public static registerPipeline<TRequest, TResponse>(
    type: Type<TRequest>,
    handler: Type<IValidator<TRequest>> | Type<IExecution<TRequest, TResponse>>,
    isValidator: boolean
  ): void {
    const pipeline = this.pipelines.get(type.name) || new Pipeline<TRequest, TResponse>();
    isValidator
      ? pipeline.setValidator(handler as Type<IValidator<TRequest>>)
      : pipeline.setExecution(handler as Type<IExecution<TRequest, TResponse>>);

    this.pipelines.set(type.name, pipeline);
  }

  public send<TResponse>(request: any): TResponse {
    const pipeline = FFlowMediator.pipelines.get(request.constructor.name);
    if (pipeline) {
      return pipeline.handle(request, this.injector);
    }

    throw new Error('Handler not registered for request type.');
  }
}
