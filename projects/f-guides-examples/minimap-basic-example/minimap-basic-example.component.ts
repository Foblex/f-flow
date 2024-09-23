import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'minimap-basic-example',
  styleUrls: [ './minimap-basic-example.component.scss' ],
  templateUrl: './minimap-basic-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class MinimapBasicExampleComponent {

}
