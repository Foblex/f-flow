import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHead } from '../../../../shared';

type FeatureIcon = 'layout' | 'move' | 'gradient' | 'map' | 'magnet' | 'zap';

interface IFeatureCard {
  icon: FeatureIcon;
  title: string;
  description: string;
  isNew?: boolean;
}

@Component({
  selector: 'home-features',
  templateUrl: './features.html',
  styleUrl: './features.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHead],
})
export class Features {
  protected readonly cards: IFeatureCard[] = [
    {
      icon: 'layout',
      title: 'Auto layout',
      description: 'Dagre and ELK engines arrange nodes and connections with a single call.',
      isNew: true,
    },
    {
      icon: 'move',
      title: 'Auto-pan',
      description: 'Opt-in plugin that keeps the dragged node in view while the canvas follows.',
      isNew: true,
    },
    {
      icon: 'gradient',
      title: 'Projected gradients',
      description: 'Smooth color transitions along connections, projected in screen space.',
    },
    {
      icon: 'map',
      title: 'Minimap',
      description: 'Always-on-screen overview with click-to-jump navigation on large graphs.',
    },
    {
      icon: 'magnet',
      title: 'Snapping & guides',
      description: 'Snap-to-grid, alignment guides, and magnetic lines while dragging.',
    },
    {
      icon: 'zap',
      title: 'Signals-first API',
      description:
        'Reactive inputs, outputs, and lifecycle built on Angular signals — no zone tricks.',
    },
  ];
}
