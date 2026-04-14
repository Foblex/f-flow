import { IPoint } from '@foblex/2d';
import { NodeType } from './node-type';
import { FlowNodeValuePatch, IFlowNodeValueByType } from './node-value';

export interface IFlowStateNode<TType extends NodeType = NodeType> {
  id: string;
  description?: string;
  isExpanded?: boolean;
  outputs: INodeOutput[];
  input?: string;
  position: IPoint;
  type: TType;
  value: IFlowNodeValueByType<TType>;
}

export interface INodeOutput {
  id: string;
  label: string;
}

export type FlowStateNode = {
  [TType in NodeType]: IFlowStateNode<TType>;
}[NodeType];

export type FlowStateNodePatch = Partial<
  Pick<FlowStateNode, 'description' | 'isExpanded' | 'outputs' | 'input' | 'position'>
> & {
  value?: FlowNodeValuePatch;
};
