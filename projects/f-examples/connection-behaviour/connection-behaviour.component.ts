import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EFConnectionBehavior, FFlowModule } from '@foblex/flow';

@Component({
  selector: 'connection-behaviour',
  styleUrls: [ './connection-behaviour.component.scss' ],
  templateUrl: './connection-behaviour.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    FFlowModule,
  ]
})
export class ConnectionBehaviourComponent {

  public eConnectionBehaviour = EFConnectionBehavior;
}
