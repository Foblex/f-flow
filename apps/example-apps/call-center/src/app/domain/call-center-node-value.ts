import { ECallCenterNodeType } from './e-call-center-node-type';

export type OperatorDepartment = 'general' | 'sales' | 'support' | 'billing' | 'complaints';
export type OperatorSkillLevel = 'any' | 'junior' | 'senior' | 'manager';
export type QueuePriority = 'low' | 'normal' | 'high' | 'urgent';

export interface ICheckScheduleNodeValue {
  startTime: string | null;
  endTime: string | null;
  timezone: string | null;
  weekends: boolean | null;
}

export interface IPlayTextNodeValue {
  text: string | null;
}

export interface IUserInputNodeValue {
  outputs: number | null;
  timeout: number | null;
}

export interface IOperatorNodeValue {
  department: OperatorDepartment | null;
  skillLevel: OperatorSkillLevel | null;
}

export interface IQueueCallNodeValue {
  queueName: string | null;
  maxWaitTime: number | null;
  priority: QueuePriority | null;
  musicOnHold: boolean | null;
}

export interface ITransferCallNodeValue {
  phoneNumber: string | null;
  ringTimeout: number | null;
}

export interface IVoicemailNodeValue {
  greeting: string | null;
  maxDuration: number | null;
}

export interface ICallCenterNodeValueMap {
  [ECallCenterNodeType.INCOMING_CALL]: null;
  [ECallCenterNodeType.CHECK_SCHEDULE]: ICheckScheduleNodeValue;
  [ECallCenterNodeType.PLAY_TEXT]: IPlayTextNodeValue;
  [ECallCenterNodeType.USER_INPUT]: IUserInputNodeValue;
  [ECallCenterNodeType.QUEUE_CALL]: IQueueCallNodeValue;
  [ECallCenterNodeType.TO_OPERATOR]: IOperatorNodeValue;
  [ECallCenterNodeType.TRANSFER_CALL]: ITransferCallNodeValue;
  [ECallCenterNodeType.VOICEMAIL]: IVoicemailNodeValue;
  [ECallCenterNodeType.DISCONNECT]: null;
}

export type CallCenterNodeValueByType<TType extends ECallCenterNodeType> =
  ICallCenterNodeValueMap[TType];
export type CallCenterNodeValue = ICallCenterNodeValueMap[ECallCenterNodeType];
export type CallCenterNodeValuePatch = Partial<Exclude<CallCenterNodeValue, null>> | null;

export interface ISelectOption<TKey extends string | number> {
  key: TKey;
  value: string;
}
