import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import {
  FCanvasComponent,
  FFlowModule
} from '@foblex/flow';
import { PointExtensions } from '@foblex/2d';

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

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
