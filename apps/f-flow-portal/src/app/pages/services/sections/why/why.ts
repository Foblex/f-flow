import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHead } from '../../../../shared';

type WhyIcon = 'authors' | 'focus' | 'ownership' | 'fixed-scope';

interface IWhyItem {
  icon: WhyIcon;
  title: string;
  description: string;
}

@Component({
  selector: 'services-why',
  templateUrl: './why.html',
  styleUrl: './why.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHead],
})
export class Why {
  protected readonly items: IWhyItem[] = [
    {
      icon: 'authors',
      title: 'We wrote the library',
      description:
        'We know the internals, the edge cases, and the trade-offs. New contractors need weeks to get there — we start on day one.',
    },
    {
      icon: 'focus',
      title: 'We only take work where Foblex Flow fits',
      description:
        "If you need something else — a React editor, a charting library, a hosted workflow product — we'll say so upfront. No pretending to be a generalist agency.",
    },
    {
      icon: 'fixed-scope',
      title: 'Fixed scope, fixed price, fixed duration',
      description:
        'No hourly creep, no surprise invoices, no black-box work. You see the scope and price before anything starts.',
    },
    {
      icon: 'ownership',
      title: 'You own the code',
      description:
        'All engagements ship with clean commits, documentation, and zero lock-in. Keep working with us or take it in-house — no contractual hooks.',
    },
  ];
}
