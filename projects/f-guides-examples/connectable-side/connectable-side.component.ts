import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connectable-side',
  styleUrls: [ './connectable-side.component.scss' ],
  templateUrl: './connectable-side.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class ConnectableSideComponent {

}
