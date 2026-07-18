import { inject, Injectable } from '@angular/core';
import { EFLayoutDirection, IFLayoutConnection, IFLayoutNode } from '@foblex/flow';
import { DagreLayoutEngine, EDagreLayoutAlgorithm } from '@foblex/flow-dagre-layout';
import { CampaignFlowSnapshot, ICampaignAddSlot } from '../domain';
import { ICampaignLayoutResult } from './i-campaign-layout-result';

export const CAMPAIGN_NODE_SIZE = { width: 300, height: 120 };
export const CAMPAIGN_ADD_SLOT_SIZE = { width: 40, height: 40 };

@Injectable()
export class CampaignLayoutCoordinator {
  private readonly _layout = inject(DagreLayoutEngine);

  public async calculate(
    snapshot: CampaignFlowSnapshot,
    direction: EFLayoutDirection,
  ): Promise<ICampaignLayoutResult> {
    const addSlots = this._createAddSlots(snapshot);
    const layoutNodes: IFLayoutNode[] = [
      ...snapshot.nodes.map((node) => ({ id: node.id, size: CAMPAIGN_NODE_SIZE })),
      ...addSlots.map((slot) => ({ id: slot.id, size: CAMPAIGN_ADD_SLOT_SIZE })),
    ];
    const layoutConnections: IFLayoutConnection[] = [
      ...snapshot.connections.map((connection) => ({
        source: connection.sourceNodeId,
        target: connection.targetNodeId,
      })),
      ...addSlots.map((slot) => ({
        source: slot.context.sourceNodeId,
        target: slot.id,
      })),
    ];
    const result = await this._layout.calculate(layoutNodes, layoutConnections, {
      direction,
      algorithm: EDagreLayoutAlgorithm.NETWORK_SIMPLEX,
      nodeGap: 100,
      layerGap: 100,
      defaultNodeSize: CAMPAIGN_NODE_SIZE,
    });
    const positions = new Map(result.nodes.map((node) => [node.id, node.position]));

    return {
      nodePositions: snapshot.nodes.map((node) => ({
        id: node.id,
        position: positions.get(node.id) ?? node.position,
      })),
      addSlots: addSlots.map((slot) => ({
        ...slot,
        position: positions.get(slot.id) ?? slot.position,
      })),
    };
  }

  private _createAddSlots(snapshot: CampaignFlowSnapshot): ICampaignAddSlot[] {
    const connectedOutputs = new Set(snapshot.connections.map((connection) => connection.sourceId));

    return snapshot.nodes.flatMap((node) =>
      node.outputs
        .filter((output) => !connectedOutputs.has(output.id))
        .map((output) => {
          const id = `add-slot:${output.id}`;

          return {
            id,
            targetConnectorId: `${id}:target`,
            position: { x: 0, y: 0 },
            context: {
              kind: 'output' as const,
              sourceNodeId: node.id,
              sourceConnectorId: output.id,
              outputLabel: output.label,
            },
          };
        }),
    );
  }
}
