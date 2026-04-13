import { IFConnectionBuilderRequest } from './i-f-connection-builder-request';
import { IFConnectionBuilderResponse } from './i-f-connection-builder-response';

export interface IFConnectionBuilder {
  handle(request: IFConnectionBuilderRequest): IFConnectionBuilderResponse;
}
