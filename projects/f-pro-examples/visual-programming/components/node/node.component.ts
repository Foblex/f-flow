import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { IFlowNodeViewModel } from '../../domain/node/i-flow-node-view-model';

@Component({
  selector: 'visual-programming-node',
  templateUrl: './node.component.html',
  styleUrls: [ './node.component.scss' ],
  standalone: true,
  imports: [
    FFlowModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NodeComponent {

  @Input()
  public node: IFlowNodeViewModel | undefined;
}
