import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule, FZoomDirective } from '@foblex/flow';
import { FCheckboxComponent } from '@foblex/f-docs';

@Component({
  selector: 'zoom',
  styleUrls: [ './zoom.component.scss' ],
  templateUrl: './zoom.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FCheckboxComponent
  ]
})
export class ZoomComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  @ViewChild(FZoomDirective, { static: true })
  public fZoom!: FZoomDirective;

  public isZoomEnabled: boolean = true;

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }

  public onZoomIn(): void {
    this.fZoom.zoomIn();
  }

  public onZoomOut(): void {
    this.fZoom.zoomOut();
  }

  public onZoomOnMouseWheelChanged(checked: boolean): void {
    this.isZoomEnabled = checked;
    this.changeDetectorRef.detectChanges();
  }
}
