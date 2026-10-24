import { inject, Injectable, Injector, Type } from '@angular/core';
import { IExecution } from './i-execution';
import { IValidator } from './i-validator';
import { Pipeline } from './pipeline';

declare const ngDevMode: boolean | undefined;

/** A request class carries its pipeline key as a static `fToken`. */
interface IRequestType {
  fToken?: string | symbol;
}

@Injectable()
export class FMediator {
  private readonly _injector = inject(Injector);

  public static pipelines = new Map<string | symbol, Pipeline<unknown, unknown>>();

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

  // run pipeline without validation and error handling; the missing-pipeline check is
  // dev-only so the production hot path stays branch-free (an unregistered request is
  // a development-time mistake: registrations are static decorators loaded with the
  // library, so the case cannot appear in a working build)
  public execute<TResponse>(request: object): TResponse {
    const pipeline = FMediator.pipelines.get(_fTokenOf(request));

    if (typeof ngDevMode === 'undefined' || ngDevMode) {
      if (!pipeline) {
        throw new Error(
          `No execution is registered for "${request.constructor.name}". Provide the execution class (it registers itself through @FExecutionRegister) in the active injector.`,
        );
      }
    }

    return pipeline!.execute(request, this._injector) as TResponse;
  }
}

function _fTokenOf(request: object): string | symbol {
  return (request.constructor as IRequestType).fToken as string | symbol;
}
