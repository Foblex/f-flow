import { Injectable } from '@angular/core';
import { IPoint } from '@foblex/2d';
import { FFlowState } from '@foblex/flow';
import { generateGuid } from '@foblex/utils';
import {
  CAMPAIGN_NODE_METADATA,
  CampaignAddContext,
  campaignInputId,
  CampaignConnectionRecord,
  CampaignNodeRecord,
  createCampaignNode,
  ECampaignNodeType,
} from '../domain';

@Injectable()
export class CampaignState extends FFlowState<CampaignNodeRecord, CampaignConnectionRecord> {
  public insertStep(context: CampaignAddContext, type: ECampaignNodeType): string | null {
    if (context.kind === 'connection' && CAMPAIGN_NODE_METADATA[type].terminal) {
      return null;
    }

    const shape = this.currentShape();
    const node = createCampaignNode(type);
    const nodes = { ...shape.nodes, [node.id]: node };
    const connections = { ...shape.connections };

    if (context.kind === 'connection') {
      const existing = connections[context.connectionId];
      if (!existing) {
        return null;
      }

      const continuation = node.outputs.find((output) => output.key === 'yes') ?? node.outputs[0];
      if (!continuation) {
        return null;
      }

      connections[existing.id] = {
        ...existing,
        targetId: campaignInputId(node.id),
        targetNodeId: node.id,
      };
      const connectionId = generateGuid();
      connections[connectionId] = {
        id: connectionId,
        sourceId: continuation.id,
        targetId: existing.targetId,
        sourceNodeId: node.id,
        targetNodeId: existing.targetNodeId,
        label: continuation.label || undefined,
      };
    } else {
      const outputAlreadyUsed = Object.values(connections).some(
        (connection) => connection.sourceId === context.sourceConnectorId,
      );
      if (outputAlreadyUsed || !shape.nodes[context.sourceNodeId]) {
        return null;
      }

      const connectionId = generateGuid();
      connections[connectionId] = {
        id: connectionId,
        sourceId: context.sourceConnectorId,
        targetId: campaignInputId(node.id),
        sourceNodeId: context.sourceNodeId,
        targetNodeId: node.id,
        label: context.outputLabel || undefined,
      };
    }

    this.commit({ ...shape, nodes, connections });

    return node.id;
  }

  public canRemoveStep(nodeId: string): boolean {
    const node = this.getNode(nodeId);
    if (
      !node ||
      node.type === ECampaignNodeType.TRIGGER ||
      node.type === ECampaignNodeType.CONDITION
    ) {
      return false;
    }

    const connections = this.connections();
    const incoming = connections.filter((connection) => connection.targetNodeId === nodeId);
    const outgoing = connections.filter((connection) => connection.sourceNodeId === nodeId);

    return incoming.length <= 1 && outgoing.length <= 1;
  }

  public removeStep(nodeId: string): boolean {
    if (!this.canRemoveStep(nodeId)) {
      return false;
    }

    const shape = this.currentShape();
    const incoming = Object.values(shape.connections).find(
      (connection) => connection.targetNodeId === nodeId,
    );
    const outgoing = Object.values(shape.connections).find(
      (connection) => connection.sourceNodeId === nodeId,
    );
    const nodes = { ...shape.nodes };
    const connections = { ...shape.connections };

    delete nodes[nodeId];
    if (incoming) {
      delete connections[incoming.id];
    }
    if (outgoing) {
      delete connections[outgoing.id];
    }
    if (incoming && outgoing) {
      connections[incoming.id] = {
        ...incoming,
        targetId: outgoing.targetId,
        targetNodeId: outgoing.targetNodeId,
      };
    }

    this.commit({
      ...shape,
      nodes,
      connections,
      selection: {
        ...shape.selection,
        nodeIds: shape.selection.nodeIds.filter((id) => id !== nodeId),
      },
    });

    return true;
  }

  public updateStep(
    nodeId: string,
    patch: Partial<Pick<CampaignNodeRecord, 'title' | 'description' | 'detail' | 'isActive'>>,
  ): void {
    this.updateNode(nodeId, patch);
  }

  public applyLayout(positions: { id: string; position: IPoint }[]): void {
    const shape = this.currentShape();
    let nodes = shape.nodes;
    let changed = false;

    for (const { id, position } of positions) {
      const node = shape.nodes[id];
      if (!node || (node.position.x === position.x && node.position.y === position.y)) {
        continue;
      }
      if (nodes === shape.nodes) {
        nodes = { ...shape.nodes };
      }
      nodes[id] = { ...node, position: { ...position } };
      changed = true;
    }

    if (changed) {
      this.amendCurrent({ ...shape, nodes });
    }
  }
}
