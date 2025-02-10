import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule, FZoomDirective } from '@foblex/flow';
import { FCheckboxComponent } from '@foblex/m-render';

@Component({
  selector: 'zoom',
  styleUrls: [ './zoom.component.scss' ],
  templateUrl: './zoom.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FCheckboxComponent,
    FZoomDirective
  ]
})
export class ZoomComponent {

  @ViewChild(FCanvasComponent, { static: true })
  protected fCanvas!: FCanvasComponent;

  @ViewChild(FZoomDirective, { static: true })
  protected fZoom!: FZoomDirective;

  protected isZoomEnabled: boolean = true;

  protected onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }

  protected onZoomIn(): void {
    this.fZoom.zoomIn();
  }

  protected onZoomOut(): void {
    this.fZoom.zoomOut();
  }

  protected onZoomOnMouseWheelChanged(checked: boolean): void {
    this.isZoomEnabled = checked;
  }
}
