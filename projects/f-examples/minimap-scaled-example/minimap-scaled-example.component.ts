import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'minimap-scaled-example',
  styleUrls: [ './minimap-scaled-example.component.scss' ],
  templateUrl: './minimap-scaled-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class MinimapScaledExampleComponent {

}
