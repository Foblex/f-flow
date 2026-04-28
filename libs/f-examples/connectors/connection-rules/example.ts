import { ChangeDetectionStrategy, Component, model, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FCreateConnectionEvent, FFlowModule } from '@foblex/flow';
import {
  FEventsPanelComponent,
  FSelectComponent,
  FToolbarComponent,
  IFEventLogEntry,
} from '@foblex/m-render';

@Component({
  selector: 'connection-rules',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FToolbarComponent, FSelectComponent, FEventsPanelComponent],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly connections = signal<{ from: string; to: string }[]>([]);

  protected readonly categories = signal(['A', 'B', 'C']);
  protected readonly category = model('A');

  protected readonly inputs = signal(['input1', 'input2', 'input3']);
  protected readonly input = model('input1');

  protected readonly events = signal<IFEventLogEntry[]>([]);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected createConnection(event: FCreateConnectionEvent): void {
    if (!event.targetId) {
      this.events.update((log) => [
        { timestamp: this._timestamp(), name: 'createConnection', value: 'rejected' },
        ...log,
      ]);

      return;
    }
    this.connections().push({ from: event.sourceId, to: event.targetId });
    this.events.update((log) => [
      {
        timestamp: this._timestamp(),
        name: 'createConnection',
        value: `${event.sourceId} → ${event.targetId}`,
      },
      ...log,
    ]);
  }

  protected deleteConnections(): void {
    this.connections.set([]);
    this.events.update((log) => [
      { timestamp: this._timestamp(), name: 'connectionsCleared' },
      ...log,
    ]);
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
