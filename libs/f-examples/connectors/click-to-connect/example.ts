import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import {
  FCanvasComponent,
  FCreateConnectionEvent,
  FFlowModule,
  provideFFlow,
  withConnectionFlow,
} from '@foblex/flow';
import { generateGuid } from '@foblex/utils';

interface IConnection {
  id: string;
  source: string;
  target: string;
}

@Component({
  selector: 'click-to-connect',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
  providers: [provideFFlow(withConnectionFlow('click'))],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly connections = signal<IConnection[]>([
    { id: generateGuid(), source: 'source-1', target: 'target-1' },
  ]);

  protected loaded(): void {
    this._canvas().resetScaleAndCenter(false);
  }

  protected createConnection(event: FCreateConnectionEvent): void {
    if (!event.targetId) {
      return;
    }

    this.connections.update((connections) => [
      ...connections,
      { id: generateGuid(), source: event.sourceId, target: event.targetId! },
    ]);
  }
}
