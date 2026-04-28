import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import {
  EFConnectionConnectableSide,
  FCanvasComponent,
  FConnectionContent,
  FFlowModule,
} from '@foblex/flow';
import { FToolbarComponent } from '@foblex/m-render';

@Component({
  selector: 'connectable-connectable-side',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FConnectionContent, FToolbarComponent],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly calculateSides = signal(false);

  protected readonly connection1SourceSide = signal(EFConnectionConnectableSide.TOP);
  protected readonly connection1TargetSide = signal(EFConnectionConnectableSide.RIGHT);
  protected readonly connection2SourceSide = signal(EFConnectionConnectableSide.BOTTOM);
  protected readonly connection2TargetSide = signal(EFConnectionConnectableSide.LEFT);
  protected readonly connection3SourceSide = signal(EFConnectionConnectableSide.CALCULATE);
  protected readonly connection3TargetSide = signal(EFConnectionConnectableSide.CALCULATE_VERTICAL);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected switchSides(): void {
    this.connection1SourceSide.update((x) => this._updateSide(x));
    this.connection1TargetSide.update((x) => this._updateSide(x));
    this.connection2SourceSide.update((x) => this._updateSide(x));
    this.connection2TargetSide.update((x) => this._updateSide(x));
    this.connection3SourceSide.update((x) => this._updateSide(x));
    this.connection3TargetSide.update((x) => this._updateSide(x));
  }

  private _updateSide(currentSide: EFConnectionConnectableSide): EFConnectionConnectableSide {
    const sides = Object.values(EFConnectionConnectableSide);
    const index = sides.indexOf(currentSide);

    return sides[(index + 1) % sides.length];
  }
}
