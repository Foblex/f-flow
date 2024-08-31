import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { IFlowNodeViewModel } from '../../domain';

@Component({
  selector: 'vp-node',
  templateUrl: './vp-node.component.html',
  styleUrls: [ './vp-node.component.scss' ],
  standalone: true,
  imports: [
    FFlowModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VpNodeComponent {

  @Input()
  public node: IFlowNodeViewModel | undefined;
}
