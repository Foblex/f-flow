import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'draggable-flow',
  styleUrls: [ './draggable-flow.component.scss' ],
  templateUrl: './draggable-flow.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class DraggableFlowComponent {

}
