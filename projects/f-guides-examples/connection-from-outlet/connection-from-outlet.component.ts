import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core';
import { FCanvasComponent, FCreateConnectionEvent, FFlowModule } from '@foblex/flow';
import { PointExtensions } from '@foblex/2d';

@Component({
  selector: 'connection-from-outlet',
  styleUrls: [ './connection-from-outlet.component.scss' ],
  templateUrl: './connection-from-outlet.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class ConnectionFromOutletComponent {

  protected fCanvas = viewChild.required(FCanvasComponent);

  protected onLoaded(): void {
    this.fCanvas().fitToScreen(PointExtensions.initialize(), false);
  }

  public connections: { outputId: string, inputId: string }[] = [];

  public addConnection(event: FCreateConnectionEvent): void {
    if(!event.fInputId) {
      return;
    }
    this.connections = this.connections.concat({ outputId: event.fOutputId, inputId: event.fInputId });
  }
}
