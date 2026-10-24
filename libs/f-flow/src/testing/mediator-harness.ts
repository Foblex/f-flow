import { FMediator } from '../_libs/f-mediator';
import { injectFromDi } from './di-harness';

export interface MediatorHarness {
  mediator: FMediator;
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

export function executeRequest<TResponse>(
  request: object,
  mediator: FMediator = injectFromDi(FMediator),
): TResponse {
  return mediator.execute<TResponse>(request);
}
