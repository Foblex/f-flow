import { IFStateData } from '@foblex/flow';
import { CallCenterConnectionRecord } from './call-center-connection';
import { CallCenterNodeRecord } from './i-call-center-node';

export type CallCenterFlowSnapshot = IFStateData<CallCenterNodeRecord, CallCenterConnectionRecord>;
