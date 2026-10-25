import { FMediator, IRequestWithResponse } from '../_libs/f-mediator';
import { injectFromDi } from './di-harness';

export interface MediatorHarness {
  mediator: FMediator;
  execute<R extends IRequestWithResponse>(request: R): R['__response'];
  execute<TResponse>(request: object): TResponse;
}

export function createMediatorHarness(
  mediator: FMediator = injectFromDi(FMediator),
): MediatorHarness {
  return {
    mediator,
    execute<TResponse>(request: object): TResponse {
      return mediator.execute<TResponse>(request);
    },
  };
}

export function executeRequest<R extends IRequestWithResponse>(
  request: R,
  mediator?: FMediator,
): R['__response'];
export function executeRequest<TResponse>(request: object, mediator?: FMediator): TResponse;
export function executeRequest<TResponse>(
  request: object,
  mediator: FMediator = injectFromDi(FMediator),
): TResponse {
  return mediator.execute<TResponse>(request);
}
