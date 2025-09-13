import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FCreateConnectionEvent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connection-rules',
  styleUrls: ['./connection-rules.scss'],
  templateUrl: './connection-rules.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
})
export class ConnectionRules {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly connections = signal<{ from: string; to: string }[]>([]);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected createConnection(event: FCreateConnectionEvent): void {
    if (!event.fInputId) {
      return;
    }
    this.connections().push({ from: event.fOutputId, to: event.fInputId });
  }

  protected deleteConnections(): void {
    this.connections.set([]);
  }
}
