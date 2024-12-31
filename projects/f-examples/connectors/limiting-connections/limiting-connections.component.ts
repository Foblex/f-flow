import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FCanvasComponent, FCreateConnectionEvent, FFlowModule } from '@foblex/flow';
import { FCheckboxComponent } from '@foblex/m-render';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'limiting-connections',
  styleUrls: [ './limiting-connections.component.scss' ],
  templateUrl: './limiting-connections.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FCheckboxComponent,
    MatIcon
  ]
})
export class LimitingConnectionsComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public connections: { from: string, to: string }[] = [];

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public onLoaded(): void {
    this.fCanvas.resetScaleAndCenter(false);
  }

  public onCreateConnection(event: FCreateConnectionEvent): void {
    if (!event.fInputId) {
      return;
    }
    this.connections.push({ from: event.fOutputId, to: event.fInputId });
  }

  public onDeleteConnections(): void {
    this.connections = [];
    this.changeDetectorRef.detectChanges();
  }
}
