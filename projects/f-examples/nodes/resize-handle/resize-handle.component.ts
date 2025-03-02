import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import {
  EFResizeHandleType,
  FCanvasComponent,
  FFlowModule
} from '@foblex/flow';
import { IRect } from '@foblex/2d';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'resize-handle',
  styleUrls: [ './resize-handle.component.scss' ],
  templateUrl: './resize-handle.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    MatIcon,
  ]
})
export class ResizeHandleComponent {

  private _fCanvas = viewChild.required(FCanvasComponent);

  protected readonly eResizeHandleType = EFResizeHandleType;

  protected onLoaded(): void {
    this._fCanvas().resetScaleAndCenter(false);
  }

  protected onNodeSizeChanged(rect: IRect): void {
    //process data
  }
}
