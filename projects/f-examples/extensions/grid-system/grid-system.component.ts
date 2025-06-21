import {ChangeDetectionStrategy, Component, signal, viewChild, ViewChild} from '@angular/core';
import { FCanvasComponent, FFlowModule, FZoomDirective } from '@foblex/flow';
import { FCheckboxComponent } from '@foblex/m-render';

@Component({
  selector: 'grid-system',
  styleUrls: [ './grid-system.component.scss' ],
  templateUrl: './grid-system.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FCheckboxComponent,
    FZoomDirective,
  ]
})
export class GridSystemComponent {

  protected adjustCellSizeWhileDragging = signal(false)

  protected readonly fCanvas = viewChild(FCanvasComponent);

  protected onLoaded(): void {
    this.fCanvas()?.resetScaleAndCenter(false);
  }

  protected onAdjustCellSizeWhileDraggingChange(event: boolean): void {
    this.adjustCellSizeWhileDragging.set(event);
  }
}
