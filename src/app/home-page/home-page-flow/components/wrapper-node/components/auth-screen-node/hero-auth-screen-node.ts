import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HeroNode } from '../../../../models/hero-node';
import { HeroNodeConnector } from '../../../connector';
import { FFlowModule } from '@foblex/flow';

@Component({
  selector: 'hero-auth-screen-node',
  styleUrls: ['./hero-auth-screen-node.scss'],
  templateUrl: './hero-auth-screen-node.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [HeroNodeConnector, FFlowModule],
})
export class HeroAuthScreenNode {
  public readonly data = input.required<HeroNode>();
}
