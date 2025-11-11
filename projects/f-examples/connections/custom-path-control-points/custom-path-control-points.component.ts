import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'custom-path-control-points',
  styleUrls: ['./custom-path-control-points.component.scss'],
  templateUrl: './custom-path-control-points.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
})
export class CustomPathControlPointsComponent {
  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  // Example 1: Simple L-shaped path
  public controlPoints1 = [{ x: 150, y: 50 }];

  // Example 2: Z-shaped path with multiple control points
  public controlPoints2 = [
    { x: 150, y: 200 },
    { x: 150, y: 250 },
    { x: 300, y: 250 },
  ];

  // Example 3: Complex industrial-style path
  public controlPoints3 = [
    { x: 100, y: 400 },
    { x: 100, y: 450 },
    { x: 200, y: 450 },
    { x: 200, y: 500 },
    { x: 300, y: 500 },
  ];

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
