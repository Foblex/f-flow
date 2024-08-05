import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { FlowComponent } from '../flow/flow.component';

@Component({
  selector: 'visual-programming-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: [ './toolbar.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {

  constructor(
    private flowComponent: FlowComponent
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
