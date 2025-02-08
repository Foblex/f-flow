import {
  ChangeDetectionStrategy, ChangeDetectorRef,
  Component, inject,
  ViewChild
} from '@angular/core';
import {
  EFMarkerType,
  FCanvasComponent, FCreateConnectionEvent, FDragStartedEvent,
  FFlowModule, FReassignConnectionEvent,
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
  ]
})
export class DragStartEndEventsComponent {
  private _changeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild(FCanvasComponent, { static: true })
  protected fCanvas!: FCanvasComponent;

  protected readonly eMarkerType = EFMarkerType;

  protected events: string[] = [];

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
    source: 'f-node-output-0',
    target: 'f-node-input-2',
  } ];

  protected onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }

  protected onDragStarted(event: FDragStartedEvent): void {
    this.events.push(`EVENT: ${ event.fEventType }, DATA: ${ JSON.stringify(event.fData) }`);
    this._changeDetectorRef.markForCheck();
  }

  protected onDragEnded(): void {
    this.events.push(`EVENT: drag-ended`);
  }

  protected onConnectionCreated(event: FCreateConnectionEvent): void {
    console.log('onConnectionCreated', event);
    if (event.fInputId) {
      this._createConnection(event.fOutputId, event.fInputId);
    }
  }

  protected onConnectionReassigned(event: FReassignConnectionEvent): void {
    if (event.newFInputId) {
      this._removeConnection(event.fConnectionId);
      this._createConnection(event.fOutputId, event.newFInputId);
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
