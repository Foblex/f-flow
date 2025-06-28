import {ChangeDetectionStrategy, Component, signal, viewChild} from '@angular/core';
import {
  FCanvasComponent,
  FCreateNodeEvent,
  FExternalItemDirective,
  FExternalItemPlaceholderDirective,
  FExternalItemPreviewDirective,
  FFlowModule
} from '@foblex/flow';
import {generateGuid} from '@foblex/utils';
import {FCheckboxComponent} from '@foblex/m-render';

@Component({
  selector: 'add-node-from-palette',
  styleUrls: ['./add-node-from-palette.component.scss'],
  templateUrl: './add-node-from-palette.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FExternalItemDirective,
    FExternalItemPlaceholderDirective,
    FExternalItemPreviewDirective,
    FCheckboxComponent,
  ]
})
export class AddNodeFromPaletteComponent {

  protected nodes = signal([{
    id: generateGuid(),
    text: 'node 1',
    position: {x: 0, y: 0},
  }, {
    id: generateGuid(),
    text: 'node 2',
    position: {x: 200, y: 0},
  }]);

  protected isMatchSize = signal(false)

  protected fCanvas = viewChild(FCanvasComponent);

  protected onLoaded(): void {
    this.fCanvas()?.resetScaleAndCenter(false);
  }

  protected onCreateNode(event: FCreateNodeEvent): void {
    this.nodes.set([...this.nodes(), {
      id: generateGuid(),
      text: event.data || 'node ' + (this.nodes().length + 1),
      position: event.rect,
    }]);
  }

  protected onPreviewMatchSizeChange(checked: boolean): void {
    this.isMatchSize.set(checked);
  }
}
