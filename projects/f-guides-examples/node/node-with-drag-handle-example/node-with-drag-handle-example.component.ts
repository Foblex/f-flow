import { ChangeDetectionStrategy, Component, viewChild, ViewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'node-with-drag-handle-example',
  styleUrls: [ './node-with-drag-handle-example.component.scss' ],
  templateUrl: './node-with-drag-handle-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class NodeWithDragHandleExampleComponent {

  protected fCanvas = viewChild.required(FCanvasComponent);

  protected onLoaded(): void {
    this.fCanvas().resetScaleAndCenter(false);
  }
}
