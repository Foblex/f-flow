import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';
import { FCheckboxComponent } from '@foblex/m-render';

@Component({
  selector: 'grid-system-example',
  styleUrls: [ './grid-system-example.component.scss' ],
  templateUrl: './grid-system-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FCheckboxComponent,
  ]
})
export class GridSystemExampleComponent {

  protected adjustCellSizeWhileDragging: boolean = false;

  @ViewChild(FCanvasComponent, { static: true })
  protected fCanvas!: FCanvasComponent;

  protected onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }

  protected onAdjustCellSizeWhileDraggingChange(event: boolean): void {
    this.adjustCellSizeWhileDragging = event;
  }
}
