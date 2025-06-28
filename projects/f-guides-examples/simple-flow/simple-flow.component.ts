import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'simple-flow',
  styleUrls: [ './simple-flow.component.scss' ],
  templateUrl: './simple-flow.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule
  ]
})
export class SimpleFlowComponent {}
