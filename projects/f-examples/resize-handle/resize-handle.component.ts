import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import {
  EFResizeHandleType,
  FCanvasComponent,
  FFlowModule
} from '@foblex/flow';

@Component({
  selector: 'resize-handle',
  styleUrls: [ './resize-handle.component.scss' ],
  templateUrl: './resize-handle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
  ]
})
export class ResizeHandleComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }

  protected readonly eResizeHandleType = EFResizeHandleType;
}
