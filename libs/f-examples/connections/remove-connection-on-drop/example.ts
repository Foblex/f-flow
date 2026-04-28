import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  ViewChild,
} from '@angular/core';
import {
  FCanvasComponent,
  FFlowComponent,
  FFlowModule,
  FReassignConnectionEvent,
} from '@foblex/flow';
import { IPoint } from '@foblex/2d';

@Component({
  selector: 'remove-connection-on-drop',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
})
export class Example {
  private _elementReference = inject(ElementRef);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  @ViewChild(FFlowComponent, { static: true })
  public fFlowComponent!: FFlowComponent;

  public nodes: { id: string; position: IPoint }[] = [
    {
      id: '1',
      position: { x: 0, y: 0 },
    },
    {
      id: '2',
      position: { x: 200, y: 100 },
    },
    {
      id: '3',
      position: { x: 400, y: 100 },
    },
  ];

  public connections: { outputId: string; inputId: string }[] = [
    { outputId: this.nodes[0].id, inputId: this.nodes[1].id },
    { outputId: this.nodes[1].id, inputId: this.nodes[2].id },
  ];

  public onConnectionDropped(event: FReassignConnectionEvent): void {
    if (!event.newTargetId) {
      this._removeConnection(event);
    } else {
      this._reassignConnection(event);
    }
    this._changeDetectorRef.detectChanges();
  }

  private _removeConnection(event: FReassignConnectionEvent): void {
    const connectionIndex = this._findConnectionIndex(event.oldSourceId, event.oldTargetId);
    if (connectionIndex === -1) {
      throw new Error('Connection not found');
    }
    this.connections.splice(connectionIndex, 1);
  }

  private _findConnectionIndex(outputId: string, inputId: string): number {
    return this.connections.findIndex((x) => x.outputId === outputId && x.inputId === inputId);
  }

  private _reassignConnection(event: FReassignConnectionEvent): void {
    this._removeConnection(event);
    this.connections.push({ outputId: event.oldSourceId, inputId: event.newTargetId! });
  }

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
