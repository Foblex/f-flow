import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { FCreateConnectionEvent, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'drag-snap-connection',
  styleUrls: [ './drag-snap-connection.component.scss' ],
  templateUrl: './drag-snap-connection.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class DragSnapConnectionComponent {

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
