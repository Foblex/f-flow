import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connection-type',
  styleUrls: [ './connection-type.component.scss' ],
  templateUrl: './connection-type.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
  ]
})
export class ConnectionTypeComponent {

}
