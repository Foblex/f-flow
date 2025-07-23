import {
  ChangeDetectionStrategy,
  Component,
  inject, OnDestroy, OnInit, Renderer2, viewChild,
} from '@angular/core';
import {
  EFMarkerType,
  FCanvasComponent,
  FCreateConnectionEvent,
  FFlowModule,
  FReassignConnectionEvent, FTriggerEvent, FZoomDirective
} from '@foblex/flow';
import { IPoint } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'custom-event-triggers',
  styleUrls: [ './custom-event-triggers.component.scss' ],
  templateUrl: './custom-event-triggers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FZoomDirective
  ]
})
export class CustomEventTriggersComponent implements OnInit, OnDestroy {

  private _rendered = inject(Renderer2);
  private _document = inject(DOCUMENT);
  protected fCanvas = viewChild(FCanvasComponent);

  protected readonly eMarkerType = EFMarkerType;

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

  protected zoomTrigger = (event: FTriggerEvent) => {
    return event.ctrlKey;
  };

  protected nodeMoveTrigger = (event: FTriggerEvent) => {
    return event.shiftKey;
  }

  protected connectionTrigger = (event: FTriggerEvent) => {
    return this._isFKeyPressed;
  }

  private _triggersListener: Function[] = [];
  private _isFKeyPressed = false;

  public ngOnInit(): void {
    this._triggersListener.push(this._rendered.listen(this._document, 'keydown', (event) => {
      if (event.key === 'F' || event.code === 'KeyF') {
        this._isFKeyPressed = true;
      }
    }));
    this._triggersListener.push(this._rendered.listen(this._document, 'keyup', (event) => {
      if (event.key === 'F' || event.code === 'KeyF') {
        this._isFKeyPressed = false;
      }
    }));
  }

  protected onLoaded(): void {
    this.fCanvas()?.resetScaleAndCenter(false);
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

  protected onNodeChanged(nodeId: string, position: IPoint): void {
    const node = this.nodes.find((x) => x.id === nodeId);
    if (node) {
      node.position = position;
    }
  }

  private _removeConnection(connectionId: string): void {
    const index = this.connections.findIndex((x) => x.id === connectionId);
    this.connections.splice(index, 1);
  }

  private _createConnection(source: string, target: string): void {
    this.connections.push({ id: generateGuid(), source, target });
  }

  private _disposeListeners(): void {
    this._triggersListener.forEach((listener) => listener());
    this._triggersListener = [];
  }

  public ngOnDestroy(): void {
    this._disposeListeners();
  }
}
