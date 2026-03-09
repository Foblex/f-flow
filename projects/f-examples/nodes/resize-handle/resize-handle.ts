import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { EFResizeHandleType, FCanvasComponent, FFlowModule } from '@foblex/flow';
import { IRect } from '@foblex/2d';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'resize-handle',
  styleUrls: ['./resize-handle.scss'],
  templateUrl: './resize-handle.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, MatIcon],
})
export class ResizeHandle {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly eResizeHandleType = EFResizeHandleType;

  protected loaded(): void {
    this._canvas().resetScaleAndCenter(false);
  }

  protected nodeSizeChanged(_rect: IRect): void {
    //process data
  }
}
