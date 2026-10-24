import { inject, Injectable, Injector, Type } from '@angular/core';
import { IExecution } from './i-execution';
import { IValidator } from './i-validator';
import { Pipeline } from './pipeline';

/** A request class carries its pipeline key as a static `fToken`. */
interface IRequestType {
  fToken?: string;
}

@Injectable()
export class FMediator {
  private readonly _injector = inject(Injector);

  public static pipelines = new Map<string, Pipeline<unknown, unknown>>();

  public static registerPipeline<TRequest, TResponse>(
    type: Type<TRequest>,
    handler: Type<IValidator<TRequest>> | Type<IExecution<TRequest, TResponse>>,
    isValidator: boolean,
  ): void {
    const fToken = (type as IRequestType | undefined)?.fToken;
    if (!fToken) {
      throw new Error('Type must have a fToken static property.');
    }

    const pipeline =
      (this.pipelines.get(fToken) as Pipeline<TRequest, TResponse> | undefined) ??
      new Pipeline<TRequest, TResponse>();
    isValidator
      ? pipeline.setValidator(handler as Type<IValidator<TRequest>>)
      : pipeline.setExecution(handler as Type<IExecution<TRequest, TResponse>>);

    this.pipelines.set(fToken, pipeline as Pipeline<unknown, unknown>);
  }

  public send<TResponse>(request: object): TResponse {
    const pipeline = FMediator.pipelines.get(_fTokenOf(request));
    if (pipeline) {
      return pipeline.handle(request, this._injector) as TResponse;
    }

    throw new Error('Handler not registered for request type.');
  }

  // run pipeline without validation and error handling
  public execute<TResponse>(request: object): TResponse {
    return FMediator.pipelines
      .get(_fTokenOf(request))!
      .execute(request, this._injector) as TResponse;
  }
}

function _fTokenOf(request: object): string {
  return (request.constructor as IRequestType).fToken as string;
}
