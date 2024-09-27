import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connector-inside-node',
  styleUrls: [ './connector-inside-node.component.scss' ],
  templateUrl: './connector-inside-node.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class ConnectorInsideNodeComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
