import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule, FZoomDirective } from '@foblex/flow';
import { FCheckboxComponent, FToolbarComponent } from '@foblex/m-render';

@Component({
  selector: 'grid-system',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FFlowModule, FCheckboxComponent, FZoomDirective, FToolbarComponent],
})
export class Example {
  protected adjustCellSizeWhileDragging = signal(false);

  protected readonly fCanvas = viewChild(FCanvasComponent);

  protected onLoaded(): void {
    this.fCanvas()?.resetScaleAndCenter(false);
  }

  protected onAdjustCellSizeWhileDraggingChange(event: boolean): void {
    this.adjustCellSizeWhileDragging.set(event);
  }
}
