import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core';
import { EFConnectableSide, FCanvasComponent, FFlowModule } from '@foblex/flow';
import { FCheckboxComponent } from '@foblex/m-render';

@Component({
  selector: 'connectable-side',
  styleUrls: ['./connectable-side.scss'],
  templateUrl: './connectable-side.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FCheckboxComponent],
})
export class ConnectableSide {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly calculateSides = signal(false);

  private readonly _outputSide = signal(EFConnectableSide.RIGHT);
  private readonly _inputSide = signal(EFConnectableSide.TOP);

  protected readonly outputSide = computed(() => {
    return this.calculateSides() ? EFConnectableSide.CALCULATE : this._outputSide();
  });
  protected readonly inputSide = computed(() => {
    return this.calculateSides() ? EFConnectableSide.CALCULATE : this._inputSide();
  });

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected switchSides(): void {
    const sides = this._sides();
    const outputIndex = sides.indexOf(this._outputSide());
    const inputIndex = sides.indexOf(this._inputSide());
    this._outputSide.set(sides[(outputIndex + 1) % sides.length]);
    this._inputSide.set(sides[(inputIndex + 1) % sides.length]);
  }

  private _sides(): EFConnectableSide[] {
    return Object.values(EFConnectableSide).filter(
      (side) => side !== EFConnectableSide.AUTO && side !== EFConnectableSide.CALCULATE,
    );
  }
}
