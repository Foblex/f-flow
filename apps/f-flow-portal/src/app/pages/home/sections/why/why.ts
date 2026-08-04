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
      title: 'The hard parts are already built',
      description:
        'Drag logic, hit-testing, SVG connection paths, reassign, selection, zoom, snapping, undo/redo — the editor plumbing you would otherwise write and maintain yourself.',
    },
    {
      title: 'Angular-native, not a wrapper',
      description:
        'Templates, forms, validators, and services stay in Angular. No React runtime, no framework bridge, no second mental model.',
    },
    {
      title: 'Accessibility as a feature, not a checkbox',
      description:
        'ARIA semantics are always on; withA11y() adds keyboard navigation, node movement, and connection creation without a mouse — for products that must pass WCAG and EAA audits.',
    },
  ];
}
