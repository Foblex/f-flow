import { EFConnectionType } from '../common';
import { IFConnectionBuilderRequest } from './i-f-connection-builder-request';

export interface IFConnectionFactoryRequest {

  type: EFConnectionType;

  payload: IFConnectionBuilderRequest;
}
