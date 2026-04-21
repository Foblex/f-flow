import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HeroNode } from '../../../../models/hero-node';
import { FFlowModule } from '@foblex/flow';
import { HeroNodeConnector } from '../../../connector';

@Component({
  selector: 'hero-decision-node',
  styleUrls: ['./hero-decision-node.scss'],
  templateUrl: './hero-decision-node.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, HeroNodeConnector],
})
export class HeroDecisionNode {
  public readonly data = input.required<HeroNode>();
}
