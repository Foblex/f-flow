import { IElkLayoutInstance } from './i-elk-layout-instance';

export interface IElkLayoutModule {
  default: new () => IElkLayoutInstance;
}
