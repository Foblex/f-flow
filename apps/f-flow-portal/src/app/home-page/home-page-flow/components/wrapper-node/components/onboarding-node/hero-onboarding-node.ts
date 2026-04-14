import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HeroNode } from '../../../../models/hero-node';
import { FFlowModule } from '@foblex/flow';
import { HeroNodeConnector } from '../../../connector';

@Component({
  selector: 'hero-onboarding-node',
  styleUrls: ['./hero-onboarding-node.scss'],
  templateUrl: './hero-onboarding-node.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, HeroNodeConnector],
})
export class HeroOnboardingNode {
  public readonly data = input.required<HeroNode>();
}
