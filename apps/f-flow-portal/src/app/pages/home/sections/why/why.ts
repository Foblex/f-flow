import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHead } from '../../../../shared';

interface IWhyCard {
  title: string;
  description: string;
}

@Component({
  selector: 'home-why',
  templateUrl: './why.html',
  styleUrl: './why.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHead],
})
export class Why {
  protected readonly cards: IWhyCard[] = [
    {
      title: 'Angular-native, not a wrapper',
      description:
        'Templates, forms, validators, and services stay in Angular. No React runtime, no framework bridge.',
    },
    {
      title: 'Start simple, scale when you need to',
      description:
        'Most editors only need f-flow, f-canvas, nodes, and connections. Caching, virtualization, and workers are optional.',
    },
    {
      title: 'Built for real editors',
      description:
        'Drag to connect, drag to reassign, selection, zoom, minimap, snapping, alignment, waypoints. Not a static diagram renderer.',
    },
  ];
}
