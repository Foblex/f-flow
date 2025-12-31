import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connection-behaviours',
  styleUrls: ['./connection-behaviours.scss'],
  templateUrl: './connection-behaviours.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
})
export class ConnectionBehaviours {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }
}
