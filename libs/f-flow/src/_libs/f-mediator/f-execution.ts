import { Provider, Type } from '@angular/core';
import { FMediator } from './f-mediator';
import { IExecution } from './i-execution';
import { FResponseOf } from './f-response-of';

/**
 * Registers an execution for a request and returns it as a provider — one line is both
 * the registry entry and the DI provider, so "registered but not provided" (or the
 * reverse) cannot happen. The pair is verified at compile time through the request's
 * `__response` phantom.
 *
 * ```ts
 * export const F_CANVAS_FEATURES = [
 *   fExecution(FitToFlowRequest, FitToFlow),
 *   fExecution(ResetScaleRequest, ResetScale),
 * ];
 * ```
 */
export function fExecution<TRequest>(
  requestType: Type<TRequest>,
  executionType: Type<IExecution<TRequest, FResponseOf<TRequest>>>,
): Provider {
  FMediator.registerPipeline(requestType, executionType, false);

  return executionType;
}
