import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowComponent, FFlowModule, FSelectionChangeEvent } from '@foblex/flow';
import { FEventsPanelComponent, FToolbarComponent, IFEventLogEntry } from '@foblex/m-render';

@Component({
  selector: 'node-selection',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FToolbarComponent, FEventsPanelComponent],
})
export class Example {
  private readonly _flow = viewChild(FFlowComponent);
  private readonly _canvas = viewChild(FCanvasComponent);

  protected readonly events = signal<IFEventLogEntry[]>([]);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected selectionChanged(event: FSelectionChangeEvent): void {
    const ids = [...event.nodeIds, ...event.connectionIds];
    this.events.update((log) => [
      {
        timestamp: this._timestamp(),
        name: 'selectionChange',
        value: ids.length ? ids.join(', ') : 'cleared',
      },
      ...log,
    ]);
  }

  protected selectNode(): void {
    this._flow()?.select(['node1'], []);
  }

  protected selectConnection(): void {
    this._flow()?.select([], ['connection1']);
  }

  private _timestamp(): string {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    const ss = String(now.getSeconds()).padStart(2, '0');
    const ms = String(now.getMilliseconds()).padStart(3, '0');

    return `${hh}:${mm}:${ss}.${ms}`;
  }
}
