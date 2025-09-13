import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import {
  EFMarkerType,
  FCanvasComponent,
  FFlowComponent,
  FFlowModule,
  FSelectionChangeEvent,
} from '@foblex/flow';
import { IPoint } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';

interface INode {
  id: string;
  position: IPoint;
  text: string;
}

interface IConnection {
  id: string;
  source: string;
  target: string;
}

interface IState {
  nodes: INode[];
  connections?: IConnection[];
}

const STATE = {
  nodes: [
    {
      id: 'node1',
      position: { x: 0, y: 0 },
      text: 'Node 1',
    },
    {
      id: 'node2',
      position: { x: 0, y: 200 },
      text: 'Node 2',
    },
    {
      id: 'node3',
      position: { x: 0, y: 400 },
      text: 'Node 3',
    },
  ],
  connections: [
    {
      id: 'connection1',
      source: 'node1output',
      target: 'node2input',
    },
    {
      id: 'connection2',
      source: 'node2output',
      target: 'node3input',
    },
  ],
};

@Component({
  selector: 'copy-paste',
  styleUrls: ['./copy-paste.scss'],
  templateUrl: './copy-paste.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
})
export class CopyPaste {
  private readonly _flow = viewChild.required(FFlowComponent);
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly clipboard = signal<IState | undefined>(undefined);
  protected readonly model = signal(STATE);
  protected readonly eMarkerType = EFMarkerType;

  protected readonly hasSelectedItems = signal<boolean>(false);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected cut(): void {
    const selection = this._flow().getSelection();
    const nodeIds = selection.fNodeIds ?? [];
    const connectionIds = selection.fConnectionIds ?? [];
    if (!nodeIds.length && !connectionIds.length) return;

    // Copy current selection into clipboard before removal
    this._copyInternal(nodeIds, connectionIds);

    this.model.update((model) => {
      const removeNodeSet = new Set(nodeIds);
      const removeConnSet = new Set(connectionIds);

      const nodes = model.nodes.filter((n) => !removeNodeSet.has(n.id));

      const connections = (model.connections ?? [])
        // remove explicitly selected connections
        .filter((c) => !removeConnSet.has(c.id))
        // remove connections linked to deleted nodes
        .filter((c) => !removeNodeSet.has(this._ownerId(c.source)))
        .filter((c) => !removeNodeSet.has(this._ownerId(c.target)));

      return { ...model, nodes, connections };
    });

    this.hasSelectedItems.set(false);
  }

  protected copy(): void {
    const selection = this._flow().getSelection();
    const nodeIds = selection.fNodeIds ?? [];
    const connectionIds = selection.fConnectionIds ?? [];
    if (!nodeIds.length && !connectionIds.length) return;

    // Copy current selection into clipboard
    this._copyInternal(nodeIds, connectionIds);
  }

  protected paste(): void {
    const clip = this.clipboard();
    if (!clip?.nodes?.length) return;

    const offset = 40;

    // Map old node ids -> new generated ids
    const idMap = new Map<string, string>();
    for (const node of clip.nodes) {
      idMap.set(node.id, generateGuid());
    }

    // Create new nodes with offset
    const newNodes: INode[] = clip.nodes.map((n) => ({
      id: idMap.get(n.id)!,
      text: n.text,
      position: { x: n.position.x + offset, y: n.position.y + offset },
    }));

    // Create new connections only if both ends exist in clipboard
    const newConnections: IConnection[] = (clip.connections ?? [])
      .filter((c) => this._clipContainsBothEnds(c))
      .map((c) => {
        const newSourceOwner = idMap.get(this._ownerId(c.source))!;
        const newTargetOwner = idMap.get(this._ownerId(c.target))!;

        return {
          id: generateGuid(),
          source: `${newSourceOwner}output`,
          target: `${newTargetOwner}input`,
        };
      });

    // Update state
    this.model.update((m) => ({
      nodes: [...m.nodes, ...newNodes],
      connections: [...(m.connections ?? []), ...newConnections],
    }));

    // Select pasted items
    this._flow().select(
      newNodes.map((n) => n.id),
      newConnections.map((c) => c.id),
      false,
    );
    this.hasSelectedItems.set(true);
  }

  protected selectionChanged(event: FSelectionChangeEvent): void {
    // We only care about nodes here; copying connections alone is not useful
    this.hasSelectedItems.set((event.fNodeIds?.length ?? 0) > 0);
  }

  // ---------- helpers ----------

  /** Returns true if both source and target node owners are in the clipboard */
  private _clipContainsBothEnds(connection: IConnection): boolean {
    const clip = this.clipboard();
    if (!clip?.nodes?.length) return false;
    const ids = new Set(clip.nodes.map((n) => n.id));
    const srcOwner = this._ownerId(connection.source);
    const tgtOwner = this._ownerId(connection.target);

    return ids.has(srcOwner) && ids.has(tgtOwner);
  }

  /** Remove -input/-output suffix or plain 'input'/'output' at the end */
  private _removeOutputInputSuffix(port: string): string {
    if (port.endsWith('-output')) return port.slice(0, -'-output'.length);
    if (port.endsWith('-input')) return port.slice(0, -'-input'.length);
    if (port.endsWith('output')) return port.slice(0, -'output'.length);
    if (port.endsWith('input')) return port.slice(0, -'input'.length);

    return port;
  }

  /** Extract owner node id from port id like 'node1-output-0' or 'node1output' */
  private _ownerId(portId: string): string {
    const base = this._removeOutputInputSuffix(portId);
    const idx = base.indexOf('-');

    return idx === -1 ? base : base.slice(0, idx);
  }

  /** Copy selected nodes and connections into clipboard */
  private _copyInternal(nodeIds: string[], connectionIds: string[]): void {
    const nodes = this.model().nodes.filter((n) => nodeIds.includes(n.id));
    const allConns = this.model().connections ?? [];
    const connections = allConns.filter((c) => connectionIds.includes(c.id));
    this.clipboard.set(this._deepClone({ nodes, connections }));
  }

  /** Simple deep clone for plain objects */
  private _deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
