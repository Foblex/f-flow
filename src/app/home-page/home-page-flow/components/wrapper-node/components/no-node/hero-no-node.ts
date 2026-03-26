import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HeroNode } from '../../../../models/hero-node';
import { FFlowModule } from '@foblex/flow';
import { HeroNodeConnector } from '../../../connector';

@Component({
  selector: 'hero-no-node',
  styleUrls: ['./hero-no-node.scss'],
  templateUrl: './hero-no-node.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, HeroNodeConnector],
})
export class HeroNoNode {
  public readonly data = input.required<HeroNode>();
}
