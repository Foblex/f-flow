import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HeroNode } from '../../../../models/hero-node';
import { FFlowModule } from '@foblex/flow';
import { HeroNodeConnector } from '../../../connector';

@Component({
  selector: 'hero-dashboard-node',
  styleUrls: ['./hero-dashboard-node.scss'],
  templateUrl: './hero-dashboard-node.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, HeroNodeConnector],
})
export class HeroDashboardNode {
  public readonly data = input.required<HeroNode>();
}
