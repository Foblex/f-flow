import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule, FZoomDirective } from '@foblex/flow';

@Component({
  selector: 'background-example',
  styleUrls: [ './background-example.component.scss' ],
  templateUrl: './background-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FZoomDirective
  ]
})
export class BackgroundExampleComponent {

}
