import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'hero-flow-anchor',
  templateUrl: './hero-flow-anchor.html',
  styleUrl: './hero-flow-anchor.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    id: 'hero-flow-anchor-container',
  },
})
export class HeroFlowAnchor {}
