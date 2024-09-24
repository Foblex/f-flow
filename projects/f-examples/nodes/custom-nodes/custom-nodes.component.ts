import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import {
  FCanvasChangeEvent,
  FCanvasComponent,
  FFlowModule
} from '@foblex/flow';
import { MatCardModule } from '@angular/material/card';
import { MatButton } from '@angular/material/button';
import { PointExtensions } from '@foblex/2d';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { BrowserService } from '@foblex/platform';

@Component({
  selector: 'custom-nodes',
  styleUrls: [ './custom-nodes.component.scss', '../../_mdc-controls.scss' ],
  templateUrl: './custom-nodes.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    MatCardModule,
    MatButton,
    MatFormFieldModule,
    MatSelect,
    MatOption
  ]
})
export class CustomNodesComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  constructor(
    private fBrowser: BrowserService
  ) {
  }

  public onLoaded(): void {
    this.fCanvas.fitToScreen(PointExtensions.initialize(100, 100), false);
  }

  public onCanvasChanged(event: FCanvasChangeEvent): void {
    this.fBrowser.document.documentElement.style.setProperty('--flow-scale', `${ event.scale }`);
  }
}
