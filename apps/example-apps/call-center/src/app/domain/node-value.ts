import { NodeType } from './node-type';

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

export interface IVoiceMailNodeValue {
  greeting: string | null;
  maxDuration: number | null;
}

export interface IFlowNodeValueMap {
  [NodeType.INCOMING_CALL]: null;
  [NodeType.CHECK_SCHEDULE]: ICheckScheduleNodeValue;
  [NodeType.PLAY_TEXT]: IPlayTextNodeValue;
  [NodeType.USER_INPUT]: IUserInputNodeValue;
  [NodeType.QUEUE_CALL]: IQueueCallNodeValue;
  [NodeType.TO_OPERATOR]: IOperatorNodeValue;
  [NodeType.TRANSFER_CALL]: ITransferCallNodeValue;
  [NodeType.VOICE_MAIL]: IVoiceMailNodeValue;
  [NodeType.DISCONNECT]: null;
}

export type IFlowNodeValueByType<TType extends NodeType> = IFlowNodeValueMap[TType];
export type FlowNodeValue = IFlowNodeValueMap[NodeType];
export type FlowNodeValuePatch = Partial<Exclude<FlowNodeValue, null>> | null;

export interface INodeSelectOption<TKey extends string | number> {
  key: TKey;
  value: string;
}
