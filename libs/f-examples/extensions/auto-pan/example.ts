import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import {
  FCanvasComponent,
  FCreateConnectionEvent,
  FFlowModule,
  FReassignConnectionEvent,
} from '@foblex/flow';
import { FCheckboxComponent, FInputComponent, FToolbarComponent } from '@foblex/m-render';

interface SourceTarget {
  source?: string;
  target?: string;
}

@Component({
  selector: 'auto-pan',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FCheckboxComponent, FToolbarComponent, FInputComponent],
})
export class Example {
  private readonly _canvas = viewChild(FCanvasComponent);

  protected readonly enabled = signal(true);
  protected readonly edgeThreshold = signal(20);
  protected readonly speed = signal(8);
  protected readonly acceleration = signal(true);

  protected readonly connections = signal<SourceTarget[]>([
    { source: 'output1', target: 'input2' },
  ]);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected createConnection({ sourceId, targetId }: FCreateConnectionEvent): void {
    if (!targetId) {
      return;
    }

    const exists = this._hasConnection(sourceId, targetId);
    if (exists) {
      return;
    }

    this.connections.update((x) => [
      ...x,
      {
        source: sourceId,
        target: targetId,
      },
    ]);
  }

  private _hasConnection(source: string, target: string): boolean {
    return this.connections().some((connection) => {
      return connection.source === source && connection.target === target;
    });
  }

  protected reassignConnection(event: FReassignConnectionEvent): void {
    if (!event.nextTargetId && !event.nextSourceId) {
      return;
    }

    this.connections.update((connections) => {
      const connection = connections.find((item) => {
        return item.source === event.previousSourceId && item.target === event.previousTargetId;
      });
      if (!connection) {
        throw new Error('Connection not found');
      }

      connection.source = event.nextSourceId || connection.source;
      connection.target = event.nextTargetId || connection.target;

      return [...connections];
    });
  }

  protected onEnabledChange(checked: boolean): void {
    this.enabled.set(checked);
  }

  protected onAccelerationChange(checked: boolean): void {
    this.acceleration.set(checked);
  }
}
