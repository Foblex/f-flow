import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EFMarkerType, FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connection-markers',
  styleUrls: [ './connection-markers.component.scss' ],
  templateUrl: './connection-markers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class ConnectionMarkersComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public eMarkerType = EFMarkerType;

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
