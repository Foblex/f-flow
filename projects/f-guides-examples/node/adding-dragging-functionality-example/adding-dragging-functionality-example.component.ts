import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'adding-dragging-functionality-example',
  styleUrls: [ './adding-dragging-functionality-example.component.scss' ],
  templateUrl: './adding-dragging-functionality-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class AddingDraggingFunctionalityExampleComponent {

}
