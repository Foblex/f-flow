import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FCreateConnectionEvent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'create-connection',
  styleUrls: [ './create-connection.component.scss' ],
  templateUrl: './create-connection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class CreateConnectionComponent {

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
