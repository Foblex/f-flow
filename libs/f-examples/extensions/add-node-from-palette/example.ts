import { ChangeDetectionStrategy, Component, signal, viewChild } from '@angular/core';
import {
  FCanvasComponent,
  FCreateNodeEvent,
  FExternalItem,
  FExternalItemPlaceholder,
  FExternalItemPreview,
  FFlowModule,
} from '@foblex/flow';
import { generateGuid } from '@foblex/utils';
import { FCheckboxComponent } from '@foblex/m-render';
import { ExampleExternalPalette, ExampleToolbar } from '@foblex/portal-ui';

@Component({
  selector: 'add-node-from-palette',
  styleUrls: ['./example.scss'],
  templateUrl: './example.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FExternalItem,
    FExternalItemPlaceholder,
    FExternalItemPreview,
    FCheckboxComponent,
    ExampleToolbar,
    ExampleExternalPalette,
  ],
})
export class Example {
  protected readonly nodes = signal([
    {
      id: generateGuid(),
      text: 'node 1',
      position: { x: 0, y: 0 },
    },
    {
      id: generateGuid(),
      text: 'node 2',
      position: { x: 200, y: 0 },
    },
  ]);

  protected readonly matchSize = signal(false);
  private readonly _canvas = viewChild(FCanvasComponent);

  protected onLoaded(): void {
    this._canvas()?.resetScaleAndCenter(false);
  }

  protected onCreateNode(event: FCreateNodeEvent): void {
    this.nodes.set([
      ...this.nodes(),
      {
        id: generateGuid(),
        text: event.data || 'node ' + (this.nodes().length + 1),
        position: event.rect,
      },
    ]);
  }

  protected previewMatchSizeChange(checked: boolean): void {
    this.matchSize.set(checked);
  }
}
