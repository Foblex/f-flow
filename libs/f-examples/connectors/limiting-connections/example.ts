import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FCreateConnectionEvent, FFlowModule } from '@foblex/flow';
import { ExampleToolbar } from '@foblex/portal-ui';

@Component({
  selector: 'limiting-connections',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, ExampleToolbar],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly connections = signal<
    {
      from: string;
      to: string;
    }[]
  >([]);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected createConnection(event: FCreateConnectionEvent): void {
    if (!event.targetId) {
      return;
    }
    this.connections.update((x) => x.concat({ from: event.sourceId, to: event.targetId! }));
  }

  protected deleteConnections(): void {
    this.connections.set([]);
  }
}
