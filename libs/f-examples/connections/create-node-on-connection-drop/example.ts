import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  viewChild,
} from '@angular/core';
import {
  FCanvasComponent,
  FCreateConnectionEvent,
  FFlowComponent,
  FFlowModule,
} from '@foblex/flow';
import { IPoint } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';
import { FToolbarComponent } from '@foblex/m-render';

//This example demonstrates how to create a new node in position where a connection was dropped.
@Component({
  selector: 'create-node-on-connection-drop',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FToolbarComponent],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);
  private readonly _flow = viewChild.required(FFlowComponent);

  public connections: { outputId: string; inputId: string }[] = [];

  public nodes: { id: string; position: IPoint }[] = [];

  private readonly _changeDetectorRef = inject(ChangeDetectorRef);

  public onConnectionDropped(event: FCreateConnectionEvent): void {
    if (!event.fInputId) {
      this._createNode(event.fOutputId, event.fDropPosition);
    } else {
      this._createConnection(event.fOutputId, event.fInputId);
    }
    this._changeDetectorRef.detectChanges();
  }

  private _createNode(outputId: string, position: IPoint): void {
    this.nodes.push({ id: generateGuid(), position: this._flow().getPositionInFlow(position) });
    this._createConnection(outputId, this.nodes[this.nodes.length - 1].id);
  }

  private _createConnection(outputId: string, inputId: string): void {
    this.connections.push({ outputId, inputId });
  }

  public onDeleteConnections(): void {
    this.connections = [];
    this._changeDetectorRef.detectChanges();
  }

  public onLoaded(): void {
    this._canvas().resetScaleAndCenter(false);
  }
}
