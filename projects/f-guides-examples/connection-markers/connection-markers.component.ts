import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EFConnectionBehavior, EFMarkerType, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connection-markers',
  styleUrls: [ './connection-markers.component.scss' ],
  templateUrl: './connection-markers.component.html',
  standalone: true,
  imports: [
    FFlowModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConnectionMarkersComponent {

  public eConnectionBehaviour = EFConnectionBehavior;

  protected readonly eMarkerType = EFMarkerType;
}
