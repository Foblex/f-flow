import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { FCanvasComponent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connection-behaviours',
  styleUrls: [ './connection-behaviours.component.scss' ],
  templateUrl: './connection-behaviours.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class ConnectionBehavioursComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }
}
