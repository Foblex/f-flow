/* eslint-disable */
import { inject, Injectable, Injector, Type } from '@angular/core';

export function requestToken(description: string): symbol {
  return Symbol(`[foblex-flow] ${description}`);
}

export interface IRequest<TResponse> {}

export interface IRequestHandler<TRequest extends IRequest<TResponse>, TResponse, TContext = any> {
  handle(request: TRequest, context: TContext): TResponse;
}

export abstract class RequestHandler<
  TRequest extends IRequest<TResponse>,
  TResponse,
  TContext = any,
> implements IRequestHandler<TRequest, TResponse, TContext>
{
  protected _context = {} as TContext;

  public handle(request: TRequest, context: TContext = {} as TContext): TResponse {
    this._context = context;

    return this.execute(request);
  }

  abstract execute(request: TRequest): TResponse;
}

export function HandlerRegister<TRequest extends IRequest<TResponse>, TResponse>(
  type: Type<TRequest>,
) {
  return function (target: Type<IRequestHandler<TRequest, TResponse>>) {
    if (!type || !(type as any).fToken) {
      throw new Error('Type must have a fToken static property.');
    }
    FMediator.registerHandler((type as any).fToken, target);
  };
}

export interface IValidatorHandler<
  TRequest extends IRequest<TResponse>,
  TResponse,
  TContext = any,
> {
  handle(request: TRequest, context: TContext): void;
}

export abstract class ValidatorHandler<
  TRequest extends IRequest<TResponse>,
  TResponse,
  TContext = any,
> implements IValidatorHandler<TRequest, TResponse, TContext>
{
  protected _context = {} as TContext;

  public handle(request: TRequest, context: TContext = {} as TContext): void {
    this._context = context;

    return this.validate(request);
  }

  abstract validate(request: TRequest): void;
}

export class EmptyValidatorHandler<
  TRequest extends IRequest<TResponse>,
  TResponse,
  TContext = any,
> extends ValidatorHandler<TRequest, TResponse, TContext> {
  public validate(request: TRequest): void {
    return;
  }
}

export function ValidatorRegister<TRequest extends IRequest<TResponse>, TResponse>(
  type: Type<TRequest>,
) {
  return function (target: Type<IValidatorHandler<TRequest, TResponse>>) {
    if (!type || !(type as any).fToken) {
      throw new Error('Type must have a fToken static property.');
    }
    FMediator.registerValidator((type as any).fToken, target);
  };
}

export class SkipRequest extends Error {
  constructor(message?: string) {
    super(message || 'Request skipped');
    this.name = 'SkipRequest';
  }
}

export class Pipeline<TRequest extends IRequest<TResponse>, TResponse, TContext = any> {
  private static readonly _EMPTY_VALIDATOR = new EmptyValidatorHandler<any, any, any>();

  private _validator?: Type<IValidatorHandler<TRequest, TResponse, TContext>> | undefined;
  private _handler?: Type<IRequestHandler<TRequest, TResponse, TContext>> | undefined;

  public handle(request: TRequest, injector: Injector): TResponse | void {
    const context: TContext = {} as TContext;
    try {
      const v = this._validator ? injector.get(this._validator) : Pipeline._EMPTY_VALIDATOR;
      v.handle(request, context);
    } catch (e) {
      if (e instanceof SkipRequest) return;
      throw e;
    }

    if (!this._handler) {
      throw new Error('Handler not registered for request');
    }

    return injector.get(this._handler).handle(request, context);
  }

  public setValidator(validator: Type<IValidatorHandler<TRequest, TResponse, TContext>>): void {
    this._validator = validator;
  }

  public setHandler(execution: Type<IRequestHandler<TRequest, TResponse, TContext>>): void {
    this._handler = execution;
  }
}

@Injectable()
export class FMediator {
  private readonly _injector = inject(Injector);
  private static _pipelines = new Map<symbol, Pipeline<any, any, any>>();

  public static registerHandler<TRequest extends IRequest<TResponse>, TResponse, TContext = any>(
    requestToken: symbol,
    handler: Type<IRequestHandler<TRequest, TResponse, TContext>>,
  ): void {
    const pipeline =
      this._pipelines.get(requestToken) || new Pipeline<TRequest, TResponse, TContext>();
    pipeline.setHandler(handler);
    this._pipelines.set(requestToken, pipeline);
  }

  public static registerValidator<TRequest extends IRequest<TResponse>, TResponse, TContext = any>(
    requestToken: symbol,
    handler: Type<IValidatorHandler<TRequest, TResponse, TContext>>,
  ): void {
    const pipeline =
      this._pipelines.get(requestToken) || new Pipeline<TRequest, TResponse, TContext>();
    pipeline.setValidator(handler);
    this._pipelines.set(requestToken, pipeline);
  }

  public execute<TResponse = any, TRequest extends IRequest<TResponse> = any>(
    request: TRequest,
  ): TResponse {
    return FMediator._pipelines
      .get((request.constructor as any).fToken)
      ?.handle(request, this._injector);
  }
}
