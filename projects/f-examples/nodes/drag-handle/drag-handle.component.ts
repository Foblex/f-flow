import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import {
  FCanvasComponent,
  FFlowModule
} from '@foblex/flow';

@Component({
  selector: 'drag-handle',
  styleUrls: [ './drag-handle.component.scss' ],
  templateUrl: './drag-handle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
  ]
})
export class DragHandleComponent {
  protected readonly fCanvas = viewChild(FCanvasComponent);

  protected onLoaded(): void {
    this.fCanvas()?.resetScaleAndCenter(false);
  }
}
