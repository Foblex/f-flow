import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'node-with-drag-handle-example',
  styleUrls: [ './node-with-drag-handle-example.component.scss' ],
  templateUrl: './node-with-drag-handle-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class NodeWithDragHandleExampleComponent {

}
