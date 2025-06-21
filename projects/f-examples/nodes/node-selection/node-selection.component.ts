import {ChangeDetectionStrategy, Component, signal, viewChild, ViewChild} from '@angular/core';
import {
  FCanvasComponent,
  FFlowModule, FSelectionChangeEvent
} from '@foblex/flow';

@Component({
  selector: 'node-selection',
  styleUrls: ['./node-selection.component.scss'],
  templateUrl: './node-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
  ]
})
export class NodeSelectionComponent {
  protected readonly fCanvas = viewChild(FCanvasComponent);

  protected events = signal<string[][]>([]);

  protected onLoaded(): void {
    this.fCanvas()?.resetScaleAndCenter(false);
  }

  protected onSelectionChange(event: FSelectionChangeEvent): void {
    this.events.update((x) => {
      return [
        ...x,
        event.fNodeIds
      ];
    });
  }
}
