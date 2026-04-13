import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HeroNode } from '../../../../models/hero-node';
import { FFlowModule } from '@foblex/flow';
import { HeroNodeConnector } from '../../../connector';

@Component({
  selector: 'hero-yes-node',
  styleUrls: ['./hero-yes-node.scss'],
  templateUrl: './hero-yes-node.html',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FFlowModule, HeroNodeConnector],
})
export class HeroYesNode {
  public readonly data = input.required<HeroNode>();
}
