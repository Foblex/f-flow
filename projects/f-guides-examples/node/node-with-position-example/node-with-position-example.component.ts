import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'node-with-position-example',
  styleUrls: [ './node-with-position-example.component.scss' ],
  templateUrl: './node-with-position-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
  ]
})
export class NodeWithPositionExampleComponent {

}
