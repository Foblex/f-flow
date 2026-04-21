import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FFlowModule } from '@foblex/flow';
import { ServiceNode } from '../../../../models/service-node';
import { ServiceNodeConnector } from '../../../connector';

@Component({
  selector: 'service-build-node',
  templateUrl: './service-build-node.html',
  styleUrls: ['./service-build-node.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, ServiceNodeConnector],
})
export class ServiceBuildNode {
  public readonly data = input.required<ServiceNode>();
}
