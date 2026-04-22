import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SectionHead } from '../../../../shared';

interface IFaqItem {
  q: string;
  a: string;
}

@Component({
  selector: 'services-faq',
  templateUrl: './faq.html',
  styleUrl: './faq.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHead],
})
export class Faq {
  protected readonly items: IFaqItem[] = [
    {
      q: 'Why should we hire you over a generic Angular agency?',
      a: "We built Foblex Flow. No generic agency has that depth — they'd need 2–4 weeks just to understand the library internals. We start on day one, solve problems faster, and know where the edge cases are.",
    },
    {
      q: 'Do we own the code?',
      a: 'Yes, fully. Every engagement ships with clean commits, full documentation, and zero contractual hooks. Keep working with us or take it in-house — entirely your choice.',
    },
    {
      q: 'How does this relate to the MIT library?',
      a: 'The library stays MIT-licensed and free forever. These services are about building on top of it faster. You can use Foblex Flow without ever talking to us — many teams do. We help when you need to ship faster or need deeper expertise.',
    },
    {
      q: 'Can you work inside our GitHub / CI / CD / review process?',
      a: 'Yes. We adapt to your workflow: your GitHub org, your PR conventions, your CI setup, your review process. We are an extension of your team during the engagement, not a black box.',
    },
    {
      q: "What's the timezone overlap?",
      a: "We're based in Warsaw, Poland (UTC+1/+2). We have 3–4 hours overlap with the US East Coast, full overlap with EU, and partial overlap with Asia-Pacific afternoons. Weekly sync calls are scheduled at mutually convenient times.",
    },
    {
      q: 'How do you invoice?',
      a: 'Via Ruul.io as EU-compliant freelancers. Invoices are issued in EUR or USD, payable by bank transfer or card. Standard NET-14 terms.',
    },
    {
      q: 'What if we need ongoing support after delivery?',
      a: 'We offer ongoing support retainers for teams running Foblex Flow in production — priority issue response, regular architecture reviews, feature consulting. Ask on the intro call.',
    },
    {
      q: 'Can we start with just an Architecture Review before committing to bigger work?',
      a: 'Yes — and we encourage it. Most Prototype Sprint and Full Partnership engagements start with a review first. It de-risks the bigger decision for both sides.',
    },
  ];

  protected onFaqToggle(event: Event): void {
    const target = event.target as HTMLDetailsElement;
    if (!target.open) {
      return;
    }
    const container = event.currentTarget as HTMLElement | null;
    container?.querySelectorAll('details[open]').forEach((d) => {
      if (d !== target) {
        (d as HTMLDetailsElement).open = false;
      }
    });
  }
}
