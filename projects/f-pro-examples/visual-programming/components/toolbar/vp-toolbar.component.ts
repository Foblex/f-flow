import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { VpFlowComponent } from '../flow/vp-flow.component';

@Component({
  selector: 'vp-toolbar',
  templateUrl: './vp-toolbar.component.html',
  styleUrls: [ './vp-toolbar.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VpToolbarComponent {

  constructor(
    private flowComponent: VpFlowComponent
  ) {
  }

  public onZoomIn(): void {
    this.flowComponent.fZoomDirective.zoomIn();
  }

  public onZoomOut(): void {
    this.flowComponent.fZoomDirective.zoomOut();
  }

  public onFitToScreen(): void {
    this.flowComponent.fCanvasComponent.fitToScreen();
  }

  public onOneToOne(): void {
    this.flowComponent.fCanvasComponent.oneToOne();
  }
}
