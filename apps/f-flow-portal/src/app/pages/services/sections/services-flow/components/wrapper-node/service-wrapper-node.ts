import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ServiceBuildNode, ServiceStepNode } from './components';
import { ServiceNode } from '../../models/service-node';

@Component({
  selector: 'service-wrapper-node',
  templateUrl: './service-wrapper-node.html',
  styleUrls: ['./service-wrapper-node.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ServiceStepNode, ServiceBuildNode],
})
export class ServiceWrapperNode {
  public readonly data = input.required<ServiceNode>();
}
