import {
  ChangeDetectionStrategy,
  Component, signal, viewChild,
} from '@angular/core';
import {
  EFMarkerType,
  FCanvasComponent, FCreateConnectionEvent, FDragStartedEvent,
  FFlowModule, FReassignConnectionEvent, FZoomDirective,
} from '@foblex/flow';
import { generateGuid } from '@foblex/utils';

@Component({
  selector: 'drag-start-end-events',
  styleUrls: [ './drag-start-end-events.component.scss' ],
  templateUrl: './drag-start-end-events.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FZoomDirective,
  ]
})
export class DragStartEndEventsComponent {

  protected fCanvas = viewChild(FCanvasComponent);

  protected readonly eMarkerType = EFMarkerType;

  protected events = signal<string[]>([])

  protected nodes = [ {
    id: '1',
    position: { x: 0, y: 200 },
    text: 'Node 1',
  }, {
    id: '2',
    position: { x: 200, y: 200 },
    text: 'Node 2',
  } ];
  protected connections = [ {
    id: '1',
    source: '1-output-0',
    target: '2-input-1',
  } ];

  protected onLoaded(): void {
    this.fCanvas()?.resetScaleAndCenter(false);
  }

  protected onDragStarted(event: FDragStartedEvent): void {
    this.events.update((x) => {
      x = x.concat(`EVENT: ${ event.fEventType }, DATA: ${ JSON.stringify(event.fData) }`);
      return x;
    });
  }

  protected onDragEnded(): void {
    this.events.update((x) => {
      x.push(`EVENT: drag-ended`);
      return x;
    });
  }

  protected onConnectionCreated(event: FCreateConnectionEvent): void {
    if (event.fInputId) {
      this._createConnection(event.fOutputId, event.fInputId);
    }
  }

  protected onConnectionReassigned(event: FReassignConnectionEvent): void {
    if (event.newTargetId) {
      this._removeConnection(event.connectionId);
      this._createConnection(event.oldSourceId, event.newTargetId);
    }
  }

  private _removeConnection(connectionId: string): void {
    const index = this.connections.findIndex((x) => x.id === connectionId);
    this.connections.splice(index, 1);
  }

  private _createConnection(source: string, target: string): void {
    this.connections.push({ id: generateGuid(), source, target });
  }
}
