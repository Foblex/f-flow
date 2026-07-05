import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import {
  FCanvasComponent,
  FCreateConnectionEvent,
  FDeleteSelectedEvent,
  FFlowModule,
  FMoveNodesEvent,
  provideFFlow,
  withA11y,
} from '@foblex/flow';
import { IPoint } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';

interface INode {
  id: string;
  label: string;
  position: IPoint;
}

interface IConnection {
  id: string;
  source: string;
  target: string;
}

@Component({
  selector: 'accessibility',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
  providers: [provideFFlow(withA11y({ moveStep: 20 }))],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly nodes = signal<INode[]>([
    { id: 'start', label: 'Start', position: { x: 0, y: 100 } },
    { id: 'validate', label: 'Validate', position: { x: 240, y: 0 } },
    { id: 'process', label: 'Process', position: { x: 240, y: 200 } },
    { id: 'finish', label: 'Finish', position: { x: 480, y: 100 } },
  ]);

  protected readonly connections = signal<IConnection[]>([
    { id: generateGuid(), source: 'start-output', target: 'validate-input' },
    { id: generateGuid(), source: 'validate-output', target: 'finish-input' },
  ]);

  protected loaded(): void {
    this._canvas().resetScaleAndCenter(false);
  }

  protected createConnection(event: FCreateConnectionEvent): void {
    const targetId = event.targetId;
    if (!targetId) {
      return;
    }

    this.connections.update((connections) => [
      ...connections,
      { id: generateGuid(), source: event.sourceId, target: targetId },
    ]);
  }

  protected moveNodes(event: FMoveNodesEvent): void {
    this.nodes.update((nodes) =>
      nodes.map((node) => {
        const moved = event.nodes.find((x) => x.id === node.id);

        return moved ? { ...node, position: moved.position } : node;
      }),
    );
  }

  protected deleteSelection(event: FDeleteSelectedEvent): void {
    this.nodes.update((nodes) => nodes.filter((x) => !event.nodeIds.includes(x.id)));
    this.connections.update((connections) =>
      connections.filter(
        (x) =>
          !event.connectionIds.includes(x.id) &&
          !event.nodeIds.some(
            (id) => x.source.startsWith(`${id}-`) || x.target.startsWith(`${id}-`),
          ),
      ),
    );
  }
}
