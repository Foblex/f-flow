import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'minimap-example',
  styleUrls: [ './minimap-example.component.scss' ],
  templateUrl: './minimap-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class MinimapExampleComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
