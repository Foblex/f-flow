import { IHandler } from './i-handler';

export interface IValidator<TRequest> extends IHandler<TRequest, boolean> {}
