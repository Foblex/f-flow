import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule, FNodeIntersectedWithConnections } from '@foblex/flow';

@Component({
  selector: 'assign-node-to-connection-on-drop',
  styleUrls: ['./assign-node-to-connection-on-drop.scss'],
  templateUrl: './assign-node-to-connection-on-drop.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
})
export class AssignNodeToConnectionOnDrop {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly nodes = [
    {
      id: '1',
      connected: true,
      position: { x: 0, y: 0 },
    },
    {
      id: '2',
      connected: true,
      position: { x: 400, y: 0 },
    },
    {
      id: '3',
      position: { x: 200, y: 200 },
    },
  ];

  protected readonly connections = signal([
    { id: '1', source: this.nodes[0].id, target: this.nodes[1].id },
  ]);

  protected nodeIntersectedWithConnection({
    fNodeId,
    fConnectionIds,
  }: FNodeIntersectedWithConnections): void {
    const connectionId = fConnectionIds?.[0];
    if (!connectionId) {
      throw new Error('Connection not found');
    }

    const node = this.nodes.find((x) => x.id === fNodeId);
    if (!node) {
      throw new Error('Node not found');
    }

    const lastTarget = this._updateCurrentConnection(connectionId, fNodeId);

    this.connections.update((x) => [
      ...x,
      {
        id: '2',
        source: fNodeId,
        target: lastTarget,
      },
    ]);

    node.connected = true;
  }

  private _updateCurrentConnection(id: string, newTarget: string): string {
    let lastTarget = '';
    this.connections.update((x) => {
      const connection = x.find((c) => c.id === id);
      if (!connection) {
        throw new Error('Connection not found');
      }
      lastTarget = connection.target;
      connection.target = newTarget;

      return x;
    });

    return lastTarget;
  }

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }
}
