import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { EFConnectableSide, FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connectable-side',
  styleUrls: ['./connectable-side.scss'],
  templateUrl: './connectable-side.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
})
export class ConnectableSide {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly calculateSides = signal(false);

  protected readonly node1Side = signal(EFConnectableSide.CALCULATE);
  protected readonly node2Side = signal(EFConnectableSide.TOP);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected switchSides(): void {
    this.node1Side.update((x) => this._updateSide(x));
    this.node2Side.update((x) => this._updateSide(x));
  }

  private _updateSide(currentSide: EFConnectableSide): EFConnectableSide {
    const sides = Object.values(EFConnectableSide);
    const index = sides.indexOf(currentSide);

    return sides[(index + 1) % sides.length];
  }
}
