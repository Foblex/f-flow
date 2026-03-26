import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import {
  HeroDecisionNode,
  HeroDashboardNode,
  HeroNoNode,
  HeroOnboardingNode,
  HeroAuthScreenNode,
  HeroYesNode,
} from './components';
import { HeroNode } from '../../models/hero-node';

@Component({
  selector: 'hero-wrapper-node',
  templateUrl: './hero-wrapper-node.html',
  styleUrls: ['./hero-wrapper-node.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    HeroAuthScreenNode,
    HeroOnboardingNode,
    HeroDashboardNode,
    HeroYesNode,
    HeroNoNode,
    HeroDecisionNode,
  ],
})
export class HeroWrapperNode {
  public readonly data = input.required<HeroNode>();
}
