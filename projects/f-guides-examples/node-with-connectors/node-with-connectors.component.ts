import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'node-with-connectors',
  styleUrls: [ './node-with-connectors.component.scss' ],
  templateUrl: './node-with-connectors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class NodeWithConnectorsComponent {

  protected fCanvas = viewChild.required(FCanvasComponent);

  protected onLoaded(): void {
    this.fCanvas().resetScaleAndCenter(false);
  }
}
