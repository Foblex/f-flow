import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { EFCanvasLayer, F_DEFAULT_LAYER_ORDER, FCanvasComponent, FFlowModule } from '@foblex/flow';
import { FToolbarComponent } from '@foblex/m-render';

@Component({
  selector: 'canvas-layers',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FToolbarComponent],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  /**
   * Live layer order. Buttons promote one layer to the top while
   * preserving the relative order of the other two.
   */
  protected readonly layers = signal<EFCanvasLayer[]>([...F_DEFAULT_LAYER_ORDER]);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(true);
  }

  protected bringNodesToTop(): void {
    this._bringToTop(EFCanvasLayer.NODES);
  }

  protected bringConnectionsToTop(): void {
    this._bringToTop(EFCanvasLayer.CONNECTIONS);
  }

  protected bringGroupsToTop(): void {
    this._bringToTop(EFCanvasLayer.GROUPS);
  }

  private _bringToTop(layer: EFCanvasLayer): void {
    this.layers.update((current) => [...current.filter((l) => l !== layer), layer]);
  }
}
