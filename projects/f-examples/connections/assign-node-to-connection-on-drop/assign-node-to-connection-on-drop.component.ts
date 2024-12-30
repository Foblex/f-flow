import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  FCanvasComponent,
  FFlowComponent,
  FFlowModule, FNodeIntersectedWithConnections,
} from '@foblex/flow';
import { IPoint } from '@foblex/2d';

@Component({
  selector: 'assign-node-to-connection-on-drop',
  styleUrls: [ './assign-node-to-connection-on-drop.component.scss' ],
  templateUrl: './assign-node-to-connection-on-drop.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class AssignNodeToConnectionOnDropComponent {

  private _elementReference = inject(ElementRef);
  private _changeDetectorRef = inject(ChangeDetectorRef);

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  @ViewChild(FFlowComponent, { static: true })
  public fFlowComponent!: FFlowComponent;

  public nodes: { id: string, isConnected: boolean, position: IPoint }[] = [ {
    id: '1',
    isConnected: true,
    position: { x: 0, y: 0 }
  }, {
    id: '2',
    isConnected: true,
    position: { x: 400, y: 0 }
  }, {
    id: '3',
    isConnected: false,
    position: { x: 200, y: 200 }
  } ];

  public connections: { id: string, outputId: string, inputId: string }[] = [

    { id: '1', outputId: this.nodes[ 0 ].id, inputId: this.nodes[ 1 ].id }
  ];

  public onNodeIntersectedWithConnection(event: FNodeIntersectedWithConnections): void {
    const node = this.nodes.find((x) => x.id === event.fNodeId);
    const connection = this.connections.find((x) => x.id === event.fConnectionIds[0]);

    const previousInputId = connection!.inputId;
    connection!.inputId = event.fNodeId;

    this.connections.push({
      id: '2',
      outputId:  event.fNodeId,
      inputId: previousInputId
    });

    node!.isConnected = true;

    this._changeDetectorRef.detectChanges();
  }

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
