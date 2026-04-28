import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import {
  EFMarkerType,
  FCanvasComponent,
  FCreateConnectionEvent,
  FFlowModule,
  FReassignConnectionEvent,
  FZoomDirective,
} from '@foblex/flow';
import { generateGuid } from '@foblex/utils';
import { FDragStartedEvent } from '@foblex/flow';
import { FEventsPanelComponent, IFEventLogEntry } from '@foblex/m-render';

@Component({
  selector: 'drag-start-end-events',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FZoomDirective, FEventsPanelComponent],
})
export class Example {
  protected fCanvas = viewChild(FCanvasComponent);

  protected readonly eMarkerType = EFMarkerType;

  protected events = signal<IFEventLogEntry[]>([]);

  protected nodes = [
    {
      id: '1',
      position: { x: 0, y: 200 },
      text: 'Node 1',
    },
    {
      id: '2',
      position: { x: 200, y: 200 },
      text: 'Node 2',
    },
  ];
  protected connections = [
    {
      id: '1',
      source: '1-output-0',
      target: '2-input-1',
    },
  ];

  protected onLoaded(): void {
    this.fCanvas()?.resetScaleAndCenter(false);
  }

  protected onDragStarted(event: FDragStartedEvent): void {
    this._log('dragStarted', `${event.fEventType} ${JSON.stringify(event.fData)}`);
  }

  protected onDragEnded(): void {
    this._log('dragEnded');
  }

  protected onConnectionCreated(event: FCreateConnectionEvent): void {
    if (event.fInputId) {
      this._createConnection(event.fOutputId, event.fInputId);
      this._log('createConnection', `${event.fOutputId} → ${event.fInputId}`);
    }
  }

  protected onConnectionReassigned(event: FReassignConnectionEvent): void {
    if (event.newTargetId) {
      this._removeConnection(event.connectionId);
      this._createConnection(event.oldSourceId, event.newTargetId);
      this._log('reassignConnection', `${event.oldSourceId} → ${event.newTargetId}`);
    }
  }

  private _removeConnection(connectionId: string): void {
    const index = this.connections.findIndex((x) => x.id === connectionId);
    this.connections.splice(index, 1);
  }

  private _createConnection(source: string, target: string): void {
    this.connections.push({ id: generateGuid(), source, target });
  }

  private _log(name: string, value?: string): void {
    this.events.update((log) => [{ timestamp: this._timestamp(), name, value }, ...log]);
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
