import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';
@Component({
  selector: 'line-alignment-example',
  styleUrls: [ './line-alignment-example.component.scss' ],
  templateUrl: './line-alignment-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class LineAlignmentExampleComponent {

}
