import { IHandler } from './i-handler';

export type IExecution<TRequest, TResponse> = IHandler<TRequest, TResponse>;
