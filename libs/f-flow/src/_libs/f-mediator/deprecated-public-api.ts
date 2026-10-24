/**
 * Deprecated public re-exports of the vendored mediator.
 *
 * The mediator is internal infrastructure of `@foblex/flow`. These aliases exist only so
 * applications migrated from the standalone `@foblex/mediator` package keep compiling
 * and keep sharing one DI token with the library. They are not a supported way to drive
 * the flow and will be removed from the public API in v20 — use the public
 * `FFlowComponent` / `FCanvasComponent` methods and the flow-scoped services
 * (`FCreateConnectionSession`, `FComponentsStore`, …) instead.
 *
 * The library's own code imports from the sibling modules directly, so nothing internal
 * is marked deprecated by this file.
 */
import { FExecutionRegister as _FExecutionRegister } from './f-execution-register';
import { FValidatorRegister as _FValidatorRegister } from './f-validator-register';
import { FMediator as _FMediator } from './f-mediator';
import { IExecution as _IExecution } from './i-execution';
import { IHandler as _IHandler } from './i-handler';
import { IValidator as _IValidator } from './i-validator';
import { Pipeline as _Pipeline } from './pipeline';

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20. Use the
 * public flow/canvas methods and flow-scoped services instead of the request pipeline.
 */
export const FMediator: typeof _FMediator = _FMediator;
/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20.
 */
export type FMediator = _FMediator;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20.
 */
export const FExecutionRegister: typeof _FExecutionRegister = _FExecutionRegister;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20.
 */
export const FValidatorRegister: typeof _FValidatorRegister = _FValidatorRegister;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20.
 */
export type IExecution<TRequest, TResponse> = _IExecution<TRequest, TResponse>;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20.
 */
export type IHandler<TRequest = void, TResponse = void> = _IHandler<TRequest, TResponse>;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20.
 */
export type IValidator<TRequest> = _IValidator<TRequest>;

/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20.
 */
export const Pipeline: typeof _Pipeline = _Pipeline;
/**
 * @deprecated Internal to `@foblex/flow`; removed from the public API in v20.
 */
export type Pipeline<TRequest, TResponse> = _Pipeline<TRequest, TResponse>;
