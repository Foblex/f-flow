import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { EFResizeHandleType, FCanvasComponent, FFlowModule } from '@foblex/flow';
import { IRect } from '@foblex/2d';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'resize-handle',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, MatIcon],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly eResizeHandleType = EFResizeHandleType;

  protected loaded(): void {
    this._canvas().resetScaleAndCenter(false);
  }

  protected nodeSizeChanged(_rect: IRect): void {
    //process data
  }
}
