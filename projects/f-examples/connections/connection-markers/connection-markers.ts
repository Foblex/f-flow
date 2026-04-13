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

  // Wait for the full render so the animated viewport reset runs
  // after both nodes and connection paths are ready.
  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(true);
  }
}
