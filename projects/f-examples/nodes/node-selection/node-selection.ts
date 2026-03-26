import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowComponent, FFlowModule, FSelectionChangeEvent } from '@foblex/flow';
import { ExampleOverlay, ExampleToolbar } from '@portal-ui';

@Component({
  selector: 'node-selection',
  styleUrls: ['./node-selection.scss'],
  templateUrl: './node-selection.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, ExampleToolbar, ExampleOverlay],
})
export class NodeSelection {
  private readonly _flow = viewChild(FFlowComponent);
  private readonly _canvas = viewChild(FCanvasComponent);

  protected readonly events = signal<string[][]>([]);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected selectionChanged(event: FSelectionChangeEvent): void {
    this.events.update((x) => {
      return [...x, [...event.nodeIds, ...event.connectionIds]];
    });
  }

  protected selectNode(): void {
    this._flow()?.select(['node1'], []);
  }

  protected selectConnection(): void {
    this._flow()?.select([], ['connection1']);
  }
}
