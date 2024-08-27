import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { IFlowNodeViewModel } from '../../domain';

@Component({
  selector: 'db-management-node',
  templateUrl: './db-management-node.component.html',
  styleUrls: [ './db-management-node.component.scss' ],
  standalone: true,
  imports: [
    FFlowModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DbManagementNodeComponent {

  @Input({ required: true })
  public node!: IFlowNodeViewModel;
}
