import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';
import { PointExtensions } from '@foblex/2d';

@Component({
  selector: 'connectable-side',
  styleUrls: [ './connectable-side.component.scss' ],
  templateUrl: './connectable-side.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class ConnectableSideComponent {
  protected fCanvas = viewChild.required(FCanvasComponent);

  protected onLoaded(): void {
    this.fCanvas().fitToScreen(PointExtensions.initialize(), false);
  }
}
