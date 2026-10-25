import { IHandler } from './i-handler';

export interface IExecution<TRequest, TResponse> extends IHandler<TRequest, TResponse> {}
