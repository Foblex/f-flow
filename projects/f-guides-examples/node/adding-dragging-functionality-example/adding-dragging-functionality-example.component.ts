import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';
import { PointExtensions } from '@foblex/2d';

@Component({
  selector: 'adding-dragging-functionality-example',
  styleUrls: [ './adding-dragging-functionality-example.component.scss' ],
  templateUrl: './adding-dragging-functionality-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class AddingDraggingFunctionalityExampleComponent {

  protected fCanvas = viewChild.required(FCanvasComponent);

  protected onLoaded(): void {
    this.fCanvas().fitToScreen(PointExtensions.initialize(), false);
  }
}
