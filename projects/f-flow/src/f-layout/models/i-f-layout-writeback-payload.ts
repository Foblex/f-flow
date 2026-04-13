import { IFLayoutNodePosition } from './i-f-layout-node-position';

export interface IFLayoutWritebackPayload {
  flowId: string;

  nodes: IFLayoutNodePosition[];

  groups: IFLayoutNodePosition[];
}

export type TFLayoutWritebackHandler = (payload: IFLayoutWritebackPayload) => void;
