import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, ViewChild } from '@angular/core';
import {
  FCanvasComponent,
  FCreateNodeEvent,
  FExternalItemDirective,
  FExternalItemPlaceholderDirective, FExternalItemPreviewDirective,
  FFlowModule
} from '@foblex/flow';
import { IPoint } from '@foblex/2d';
import { generateGuid } from '@foblex/utils';
import { FCheckboxComponent } from '@foblex/m-render';

@Component({
  selector: 'external-item-example',
  styleUrls: [ './external-item-example.component.scss' ],
  templateUrl: './external-item-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FExternalItemDirective,
    FExternalItemPlaceholderDirective,
    FExternalItemPreviewDirective,
    FCheckboxComponent
  ]
})
export class ExternalItemExampleComponent {

  private _changeDetectorRef = inject(ChangeDetectorRef);

  protected nodes: { id: string, text: string, position: IPoint }[] = [{
    id: generateGuid(),
    text: 'node 1',
    position: { x: 0, y: 0 }
  },{
    id: generateGuid(),
    text: 'node 2',
    position: { x: 200, y: 0 }
  }];

  protected isMatchSize: boolean = false;

  @ViewChild(FCanvasComponent, { static: true })
  protected fCanvas!: FCanvasComponent;

  protected onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }

  protected onCreateNode(event: FCreateNodeEvent): void {
    this.nodes.push({
      id: generateGuid(),
      text: event.data || 'node ' + (this.nodes.length + 1),
      position: event.rect
    });
    this._changeDetectorRef.markForCheck();
  }

  protected onPreviewMatchSizeChange(checked: boolean): void {
    this.isMatchSize = checked;
  }
}
