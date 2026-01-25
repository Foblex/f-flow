import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { EFMarkerType, FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connection-markers',
  styleUrls: ['./connection-markers.scss'],
  templateUrl: './connection-markers.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
})
export class ConnectionMarkers {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly eMarkerType = EFMarkerType;

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }
}
