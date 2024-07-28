import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FCreateConnectionEvent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connection-from-outlet-sample',
  styleUrls: [ './connection-from-outlet-sample.component.scss' ],
  templateUrl: './connection-from-outlet-sample.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class ConnectionFromOutletSampleComponent {

  public connections: { outputId: string, inputId: string }[] = [];

  constructor(
    private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  public addConnection(event: FCreateConnectionEvent): void {
    if(!event.fInputId) {
      return;
    }
    this.connections.push({ outputId: event.fOutputId, inputId: event.fInputId });
    this.changeDetectorRef.detectChanges();
  }
}
