import { ChangeDetectionStrategy, Component, viewChild, ViewChild } from '@angular/core';
import {
  FCanvasComponent, FDropToGroupEvent,
  FFlowModule,
} from '@foblex/flow';

@Component({
  selector: 'drag-to-group',
  styleUrls: [ './drag-to-group.component.scss' ],
  templateUrl: './drag-to-group.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
  ]
})
export class DragToGroupComponent {
  protected readonly fCanvas = viewChild(FCanvasComponent);

  protected parentGroup: string | undefined;

  protected nodeText = 'Drag me to the group';

  protected onLoaded(): void {
    this.fCanvas()?.resetScaleAndCenter(false);
  }

  protected onDropToGroup(event: FDropToGroupEvent): void {
    if(event.fTargetNode === 'group1') {
      this.parentGroup = 'group1';
      this.nodeText = 'I am in group1';
    }
  }
}
