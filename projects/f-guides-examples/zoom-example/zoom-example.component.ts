import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule, FZoomDirective } from '@foblex/flow';

@Component({
  selector: 'zoom-example',
  styleUrls: [ './zoom-example.component.scss' ],
  templateUrl: './zoom-example.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
    FZoomDirective
  ]
})
export class ZoomExampleComponent {

}
