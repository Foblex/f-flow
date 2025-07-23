import {ChangeDetectionStrategy, Component, viewChild} from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';
import {MatIcon} from "@angular/material/icon";

@Component({
  selector: 'minimap-example',
  styleUrls: [ './minimap-example.component.scss' ],
  templateUrl: './minimap-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    MatIcon
  ]
})
export class MinimapExampleComponent {

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
