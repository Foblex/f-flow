import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'zoom-example',
  styleUrls: [ './zoom-example.component.scss' ],
  templateUrl: './zoom-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class ZoomExampleComponent {

}
