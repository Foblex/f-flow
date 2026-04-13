import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FCreateConnectionEvent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'drag-to-connect',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly connections = signal<{ source: string; target: string }[]>([]);

  protected createConnection(event: FCreateConnectionEvent): void {
    const target = event.fInputId;
    if (!target) {
      return;
    }
    this.connections.update((x) => [...x, { source: event.fOutputId, target }]);
  }

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }
}
