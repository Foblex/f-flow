import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { SectionHead } from '../../../../shared';

interface ITier {
  name: string;
  fitFor: string;
  price: string;
  duration: string;
  description: string;
  bullets: string[];
  cta: string;
  featured?: boolean;
  badge?: string;
}

@Component({
  selector: 'services-tiers',
  templateUrl: './tiers.html',
  styleUrl: './tiers.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHead],
})
export class Tiers {
  public readonly contactClick = output<void>();

  protected readonly tiers: ITier[] = [
    {
      name: 'Architecture review',
      fitFor: 'For teams validating a design or inheriting a node editor',
      price: '$1,500',
      duration: '1 week',
      description:
        'Fixed-scope review of your current or planned node editor. We read your code, diagnose bottlenecks, and deliver a written report with a recommended path forward.',
      bullets: [
        'Written architecture report (5–10 pages)',
        'Prioritized list of issues and opportunities',
        'Written walkthrough with your team',
        'Follow-up Q&A for 2 weeks after delivery',
      ],
      cta: 'Start with this',
    },
    {
      name: 'Prototype sprint',
      fitFor: 'For teams shipping the first working version',
      price: '$5,000 – $15,000',
      duration: '2 – 4 weeks',
      description:
        'We build a working prototype of your editor on Foblex Flow: custom nodes, connection rules, layout, persistence. You get production-ready code and a written walkthrough.',
      bullets: [
        'Working prototype in your Angular codebase',
        'Custom nodes and connection rules for your domain',
        'Full source with clean commits and docs',
        'Written handoff with your team',
      ],
      cta: 'Choose this',
      featured: true,
      badge: 'Most popular',
    },
    {
      name: 'Full product partnership',
      fitFor: 'For teams building a full product end-to-end',
      price: '$25,000+',
      duration: '2 – 6 months',
      description:
        'End-to-end development of your node-based product. Weekly written reviews, clean handoff, documentation, and training materials for your team.',
      bullets: [
        'Full editor implementation in your stack',
        'Weekly written progress updates',
        'Complete documentation and testing',
        'Training materials for your internal team',
      ],
      cta: 'Partner with us',
    },
  ];

  protected onContact(event: Event): void {
    event.preventDefault();
    this.contactClick.emit();
  }
}
