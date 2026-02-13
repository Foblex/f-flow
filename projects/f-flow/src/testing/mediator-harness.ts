import { FMediator } from '@foblex/mediator';
import { injectFromDi } from './di-harness';

export interface MediatorHarness {
  mediator: FMediator;
  execute<TResponse>(request: unknown): TResponse;
}

export function createMediatorHarness(
  mediator: FMediator = injectFromDi(FMediator),
): MediatorHarness {
  return {
    mediator,
    execute<TResponse>(request: unknown): TResponse {
      return mediator.execute<TResponse>(request);
    },
  };
}

export function executeRequest<TResponse>(
  request: unknown,
  mediator: FMediator = injectFromDi(FMediator),
): TResponse {
  return mediator.execute<TResponse>(request);
}
