import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { EFConnectableSide, FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connectable-side',
  styleUrls: ['./connectable-side.component.scss'],
  templateUrl: './connectable-side.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule],
})
export class ConnectableSideComponent {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected outputSide = signal(EFConnectableSide.RIGHT);
  protected inputSide = signal(EFConnectableSide.TOP);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected switchSides(): void {
    const sides = this._sides();
    const outputIndex = sides.indexOf(this.outputSide());
    const inputIndex = sides.indexOf(this.inputSide());
    this.outputSide.set(sides[(outputIndex + 1) % sides.length]);
    this.inputSide.set(sides[(inputIndex + 1) % sides.length]);
  }

  private _sides(): EFConnectableSide[] {
    return Object.values(EFConnectableSide).filter((side) => side !== EFConnectableSide.AUTO);
  }
}
