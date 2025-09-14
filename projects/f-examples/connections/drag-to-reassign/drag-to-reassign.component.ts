import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule, FReassignConnectionEvent } from '@foblex/flow';
import { FCheckboxComponent } from '@foblex/m-render';

@Component({
  selector: 'drag-to-reassign',
  styleUrls: ['./drag-to-reassign.component.scss'],
  templateUrl: './drag-to-reassign.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FCheckboxComponent],
})
export class DragToReassignComponent {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly reassignableStart = signal(false);
  protected readonly connections = signal([{ id: '1', source: '1', target: '3' }]);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected reassignConnection(event: FReassignConnectionEvent): void {
    if (!event.newTargetId && !event.newSourceId) {
      return;
    }
    this.connections.update((x) => {
      const connection = x.find(
        (c) => c.source === event.oldSourceId && c.target === event.oldTargetId,
      );
      if (!connection) {
        throw new Error('Connection not found');
      }
      connection.source = event.newSourceId || connection.source;
      connection.target = event.newTargetId || connection.target;

      return [...x];
    });
  }

  protected reassignStartChange(): void {
    this.reassignableStart.update((x) => !x);
  }
}
