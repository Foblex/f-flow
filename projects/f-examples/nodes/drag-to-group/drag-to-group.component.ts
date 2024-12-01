import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
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

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public parentGroup: string | undefined;

  public nodeText = 'Drag me to the group';

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }

  public onDropToGroup(event: FDropToGroupEvent): void {
    if(event.fTargetNode === 'group1') {
      this.parentGroup = 'group1';
      this.nodeText = 'I am in group1';
    }
  }
}
