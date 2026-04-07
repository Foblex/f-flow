import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'draggable-flow',
  styleUrls: ['./draggable-flow.scss'],
  templateUrl: './draggable-flow.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
})
export class DraggableFlow {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }
}
