import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { FCanvasComponent, FCreateConnectionEvent, FFlowModule } from '@foblex/flow';
import { FCheckboxComponent } from '@foblex/f-docs';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'connector-outlet',
  styleUrls: [ './connector-outlet.component.scss' ],
  templateUrl: './connector-outlet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FCheckboxComponent,
    MatIcon
  ]
})
export class ConnectorOutletComponent {

  @ViewChild(FCanvasComponent, { static: true })
  public fCanvas!: FCanvasComponent;

  public connections: { from: string, to: string }[] = [];

  public isConnectionFromOutlet: boolean = false;

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

  public onConnectionFromOutletChange(checked: boolean): void {
    this.isConnectionFromOutlet = checked;
  }
}
