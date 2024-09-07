import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'groups-simple-example',
  styleUrls: [ './groups-simple-example.component.scss' ],
  templateUrl: './groups-simple-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class GroupsSimpleExampleComponent {

}
