import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import {
  EFResizeHandleType,
  FCanvasComponent,
  FFlowModule
} from '@foblex/flow';
import { PointExtensions } from '@foblex/2d';

@Component({
  selector: 'grouping',
  styleUrls: [ './grouping.component.scss' ],
  templateUrl: './grouping.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
  ]
})
export class GroupingComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public onLoaded(): void {
    this.fCanvas.fitToScreen(PointExtensions.initialize(50, 50), false);
  }

  protected readonly eResizeHandleType = EFResizeHandleType;
}
