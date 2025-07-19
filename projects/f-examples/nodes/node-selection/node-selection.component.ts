import {ChangeDetectionStrategy, Component, signal, viewChild, ViewChild} from '@angular/core';
import {
  FCanvasComponent, FFlowComponent,
  FFlowModule, FSelectionChangeEvent
} from '@foblex/flow';
import {FCheckboxComponent} from "@foblex/m-render";

@Component({
  selector: 'node-selection',
  styleUrls: ['./node-selection.component.scss'],
  templateUrl: './node-selection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FCheckboxComponent,
  ]
})
export class NodeSelectionComponent {
  private readonly _flow = viewChild(FFlowComponent);
  private readonly _canvas = viewChild(FCanvasComponent);

  protected events = signal<string[][]>([]);

  protected onLoaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected onSelectionChange(event: FSelectionChangeEvent): void {
    this.events.update((x) => {
      return [
        ...x,
        [...event.fNodeIds, ...event.fConnectionIds]
      ];
    });
  }

  protected selectNode(): void {
    this._flow()?.select(['f-node-0'], []);
  }

  protected selectConnection(): void {
    this._flow()?.select([], ['f-connection-0']);
  }
}
