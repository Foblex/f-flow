import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'node-with-connectors',
  styleUrls: [ './node-with-connectors.component.scss' ],
  templateUrl: './node-with-connectors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class NodeWithConnectorsComponent {

}
