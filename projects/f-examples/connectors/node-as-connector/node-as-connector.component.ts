import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'node-as-connector',
  styleUrls: [ './node-as-connector.component.scss' ],
  templateUrl: './node-as-connector.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class NodeAsConnectorComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
