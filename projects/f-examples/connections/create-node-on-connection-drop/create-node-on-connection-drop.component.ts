import {ChangeDetectionStrategy, ChangeDetectorRef, Component, viewChild, ViewChild} from '@angular/core';
import { FCanvasComponent, FCreateConnectionEvent, FFlowComponent, FFlowModule } from '@foblex/flow';
import { IPoint } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';

//This example demonstrates how to create a new node in position where a connection was dropped.
@Component({
  selector: 'create-node-on-connection-drop',
  styleUrls: [ './create-node-on-connection-drop.component.scss' ],
  templateUrl: './create-node-on-connection-drop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class CreateNodeOnConnectionDropComponent {

  private readonly _canvas = viewChild.required(FCanvasComponent);
  private readonly _flow = viewChild.required(FFlowComponent);

  public connections: { outputId: string, inputId: string }[] = [];

  public nodes: { id: string, position: IPoint }[] = [];

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public onConnectionDropped(event: FCreateConnectionEvent): void {
    if(!event.fInputId) {
      this.createNode(event.fOutputId, event.fDropPosition);
    } else {
      this.createConnection(event.fOutputId, event.fInputId);
    }
    this.changeDetectorRef.detectChanges();
  }

  private createNode(outputId: string, position: IPoint): void {
    this.nodes.push({ id: generateGuid(), position: this._flow().getPositionInFlow(position) });
    this.createConnection(outputId, this.nodes[this.nodes.length - 1].id);
  }

  private createConnection(outputId: string, inputId: string): void {
    this.connections.push({ outputId: outputId, inputId: inputId });
  }

  public onDeleteConnections(): void {
    this.connections = [];
    this.changeDetectorRef.detectChanges();
  }

  public onLoaded(): void {
    this._canvas().resetScaleAndCenter(false);
  }
}
