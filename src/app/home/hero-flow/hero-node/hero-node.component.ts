import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { IHeroFlowNode } from '../domain/i-hero-flow-node';

@Component({
  selector: 'div[hero-node]',
  templateUrl: './hero-node.component.html',
  styleUrls: [ './hero-node.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroNodeComponent {

  @Input({ required: true })
  public node!: IHeroFlowNode;

  @HostBinding('class.large')
  public get isLarge(): boolean {
    return this.node.large ?? false;
  }
}
