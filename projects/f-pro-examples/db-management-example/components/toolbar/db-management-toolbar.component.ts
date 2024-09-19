import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { DbManagementFlowComponent } from '../flow/db-management-flow.component';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'db-management-toolbar',
  templateUrl: './db-management-toolbar.component.html',
  styleUrls: [ './db-management-toolbar.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    MatIcon
  ]
})
export class DbManagementToolbarComponent {

  constructor(
    private flowComponent: DbManagementFlowComponent
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
    this.flowComponent.fCanvasComponent.resetScaleAndCenter();
  }
}
