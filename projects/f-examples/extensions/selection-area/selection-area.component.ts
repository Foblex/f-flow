import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'selection-area',
  styleUrls: [ './selection-area.component.scss' ],
  templateUrl: './selection-area.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class SelectionAreaComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
