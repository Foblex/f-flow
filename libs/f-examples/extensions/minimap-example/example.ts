import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'minimap-example',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected onLoaded(): void {
    this._canvas().resetScaleAndCenter(false);
  }

  public onFitToScreen(): void {
    this._canvas().fitToScreen();
  }

  public onOneToOne(): void {
    this._canvas().resetScaleAndCenter();
  }
}
