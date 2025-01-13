import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'grid-system-example',
  styleUrls: [ './grid-system-example.component.scss' ],
  templateUrl: './grid-system-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
  ]
})
export class GridSystemExampleComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
