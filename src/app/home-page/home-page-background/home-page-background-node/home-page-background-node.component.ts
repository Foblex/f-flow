import { ChangeDetectionStrategy, Component, HostBinding, Input } from '@angular/core';
import { IHeroFlowNode } from '../domain/i-hero-flow-node';

@Component({
  selector: 'div[home-page-background-node]',
  templateUrl: './home-page-background-node.component.html',
  styleUrls: [ './home-page-background-node.component.scss' ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePageBackgroundNodeComponent {

  @Input({ required: true })
  public node!: IHeroFlowNode;

  @HostBinding('class.large')
  public get isLarge(): boolean {
    return this.node.large ?? false;
  }
}
