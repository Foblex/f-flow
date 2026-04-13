import { IFFlowState } from '../../domain';
import { IFLayoutConnection, IFLayoutGraph, IFLayoutNode } from '../models';

export interface IFlowLayoutNormalizationResult extends IFLayoutGraph {
  nodeIds: Set<string>;
  groupIds: Set<string>;
}

export function normalizeFlowLayoutData(state: IFFlowState): IFlowLayoutNormalizationResult {
  const nodes = [...state.nodes.map(mapNode), ...state.groups.map(mapNode)];
  const nodeIds = new Set(state.nodes.map((node) => node.id));
  const groupIds = new Set(state.groups.map((group) => group.id));
  const outputNodeIds = new Map<string, string>();
  const inputNodeIds = new Map<string, string>();

  for (const item of [...state.nodes, ...state.groups]) {
    for (const output of item.fOutputs) {
      outputNodeIds.set(output.id, item.id);
    }

    for (const input of item.fInputs) {
      inputNodeIds.set(input.id, item.id);
    }
  }

  const connections = state.connections.reduce<IFLayoutConnection[]>((result, connection) => {
    const sourceNodeId = outputNodeIds.get(connection.fOutputId);
    const targetNodeId = inputNodeIds.get(connection.fInputId);

    if (!sourceNodeId || !targetNodeId) {
      return result;
    }

    result.push({
      source: sourceNodeId,
      target: targetNodeId,
    });

    return result;
  }, []);

  return { nodes, connections, nodeIds, groupIds };
}

function mapNode(node: IFFlowState['nodes'][number]): IFLayoutNode {
  return {
    id: node.id,
    size: node.measuredSize ? { ...node.measuredSize } : node.size ? { ...node.size } : undefined,
  };
}
