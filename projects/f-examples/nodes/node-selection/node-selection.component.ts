import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import {
  FCanvasComponent,
  FFlowModule, FSelectionChangeEvent
} from '@foblex/flow';

@Component({
  selector: 'node-selection',
  styleUrls: [ './node-selection.component.scss' ],
  templateUrl: './node-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
  ]
})
export class NodeSelectionComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public selection: string[][] = [];

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }

  public onSelectionChange(event: FSelectionChangeEvent): void {
    this.selection.push(event.fNodeIds);
  }
}
