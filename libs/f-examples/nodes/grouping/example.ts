import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';
import { FCheckboxComponent, FToolbarComponent } from '@foblex/m-render';
import { IRect } from '@foblex/2d';

@Component({
  selector: 'grouping',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FCheckboxComponent, FToolbarComponent],
})
export class Example {
  private readonly _canvas = viewChild.required(FCanvasComponent);

  protected readonly includePaddings = signal<boolean>(true);
  protected readonly autoSizeToFitChildren = signal<boolean>(true);
  protected readonly autoExpandOnChildHit = signal<boolean>(true);

  protected loaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected changePaddings(): void {
    this.includePaddings.set(!this.includePaddings());
  }

  protected changeSizeToFitChildren(): void {
    this.autoSizeToFitChildren.set(!this.autoSizeToFitChildren());
  }

  protected changeExpandOnChildHit(): void {
    this.autoExpandOnChildHit.set(!this.autoExpandOnChildHit());
  }

  protected sizeChanged(_event: IRect): void {
    // This event is emitted only when a child node or group movement
    // actually changes (resizes) the boundaries of its parent.
    // Typical scenarios:
    //  - A child is dragged toward the edge and triggers auto-expand.
    //  - Children layout causes auto-size to recalculate the parent bounds.
    // If no real size change occurs, the event is not fired.
  }
}
