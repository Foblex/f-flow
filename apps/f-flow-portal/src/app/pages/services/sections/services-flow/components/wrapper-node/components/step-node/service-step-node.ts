import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { ServiceNode } from '../../../../models/service-node';
import { ServiceNodeConnector } from '../../../connector';

@Component({
  selector: 'service-step-node',
  templateUrl: './service-step-node.html',
  styleUrls: ['./service-step-node.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, ServiceNodeConnector],
})
export class ServiceStepNode {
  public readonly data = input.required<ServiceNode>();
}
