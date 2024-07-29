import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'background-example',
  styleUrls: [ './background-example.component.scss' ],
  templateUrl: './background-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class BackgroundExampleComponent {

}
