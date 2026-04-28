import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DOCUMENT } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CookiePopup, GTagService, IS_BROWSER_PLATFORM, ThemeService } from '@foblex/m-render';
import { PORTAL_SHELL } from '../../portal-shell';
import { Seo } from '../../core/seo';
import { StructuredData } from '../../core/structured-data';
import { PortalFooter, PortalHeader, IFooterColumn } from '../../shared';
import { Cases, Faq, Final, Hero, ServicesFlow, Steps, Team, Tiers, Why } from './sections';

@Component({
  selector: 'services',
  templateUrl: './services.html',
  styleUrl: './services.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CookiePopup,
    PortalHeader,
    PortalFooter,
    ServicesFlow,
    Hero,
    Tiers,
    Why,
    Cases,
    Steps,
    Faq,
    Team,
    Final,
  ],
})
export class Services implements OnInit, AfterViewInit {
  private readonly _document = inject(DOCUMENT);
  private readonly _destroyRef = inject(DestroyRef);
  private readonly _route = inject(ActivatedRoute);
  private readonly _gTagService = inject(GTagService, { optional: true });
  private readonly _themeService = inject(ThemeService, { optional: true });
  private readonly _seo = inject(Seo);
  private readonly _structuredData = inject(StructuredData);

  protected readonly isBrowser = inject(IS_BROWSER_PLATFORM);

  protected readonly logo = PORTAL_SHELL.logo;
  protected readonly title = PORTAL_SHELL.appName;

  protected readonly tagline =
    'Angular-native node-based UI library for workflow builders, AI pipelines, and visual editors.';

  protected readonly footerColumns: IFooterColumn[] = [
    {
      title: 'Product',
      links: [
        { text: 'Docs', routerLink: '/docs/get-started' },
        { text: 'Examples', routerLink: '/examples/overview' },
        { text: 'Showcase', routerLink: '/showcase/overview' },
        { text: 'Changelog', href: 'https://github.com/Foblex/f-flow/blob/main/CHANGELOG.md' },
        { text: 'GitHub', href: 'https://github.com/Foblex/f-flow' },
      ],
    },
    {
      title: 'Services',
      links: [
        { text: 'Engagements', routerLink: '/services', fragment: 'engagements' },
        { text: 'Why us', routerLink: '/services', fragment: 'why' },
        { text: 'Case studies', routerLink: '/services', fragment: 'cases' },
        { text: 'Process', routerLink: '/services', fragment: 'process' },
        { text: 'FAQ', routerLink: '/services', fragment: 'faq' },
        { text: 'Contact', routerLink: '/services', fragment: 'contact' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'Articles', routerLink: '/blog/overview' },
        { text: 'Team', routerLink: '/services', fragment: 'team' },
        { text: 'LinkedIn', href: 'https://www.linkedin.com/company/foblex' },
      ],
    },
  ];

  public ngOnInit(): void {
    this._seo.apply({
      title: 'Foblex Flow Services — Work with the Team that Built the Library',
      description:
        'Architecture reviews, prototype sprints, and full product partnerships for Angular node editors, low-code platforms, and AI agent UIs. Fixed prices from $1,500.',
      canonicalUrl: 'https://flow.foblex.com/services',
    });

    this._publishStructuredData();

    if (!this.isBrowser) {
      return;
    }
    this._themeService?.initialize();
    this._gTagService?.initialize();
  }

  private _publishStructuredData(): void {
    const provider = {
      '@type': 'Organization',
      '@id': 'https://flow.foblex.com/#organization',
      name: 'Foblex',
      url: 'https://flow.foblex.com/',
    };

    const service = (
      name: string,
      description: string,
      lowPrice: number,
      highPrice: number | null,
    ) => ({
      '@type': 'Service',
      provider,
      serviceType: name,
      name,
      description,
      areaServed: 'Worldwide',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'USD',
        priceSpecification: {
          '@type': 'PriceSpecification',
          priceCurrency: 'USD',
          price: lowPrice,
          ...(highPrice !== null ? { maxPrice: highPrice, minPrice: lowPrice } : {}),
        },
        url: 'https://flow.foblex.com/services',
      },
    });

    const faqEntries = [
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
        a: "We're based in Warsaw, Poland (UTC+1/+2). We have 3–4 hours overlap with the US East Coast, full overlap with EU, and partial overlap with Asia-Pacific afternoons. Communication is primarily asynchronous via email and shared docs, with written weekly updates.",
      },
      {
        q: 'How do you invoice?',
        a: 'Via Ruul.io as EU-compliant freelancers. Invoices are issued in EUR or USD, payable by bank transfer or card. Standard NET-14 terms.',
      },
      {
        q: 'What if we need ongoing support after delivery?',
        a: 'We offer ongoing support retainers for teams running Foblex Flow in production — priority issue response, regular architecture reviews, feature consulting. Email us to discuss what you need.',
      },
      {
        q: 'Can we start with just an Architecture Review before committing to bigger work?',
        a: 'Yes — and we encourage it. Most Prototype Sprint and Full Partnership engagements start with a review first. It de-risks the bigger decision for both sides.',
      },
    ];

    this._structuredData.set('services-graph', {
      '@context': 'https://schema.org',
      '@graph': [
        provider,
        service(
          'Architecture Review',
          'Fixed-scope review of a current or planned Angular node editor. Written report, 60-minute walkthrough, 2-week follow-up Q&A.',
          1500,
          null,
        ),
        service(
          'Prototype Sprint',
          'Working prototype on Foblex Flow with custom nodes, connection rules, layout, persistence. Production-ready code and walkthrough.',
          5000,
          15000,
        ),
        service(
          'Full Product Partnership',
          'End-to-end development of a node-based Angular product. Weekly reviews, clean handoff, documentation, training.',
          25000,
          null,
        ),
        {
          '@type': 'FAQPage',
          mainEntity: faqEntries.map((entry) => ({
            '@type': 'Question',
            name: entry.q,
            acceptedAnswer: { '@type': 'Answer', text: entry.a },
          })),
        },
      ],
    });
  }

  public ngAfterViewInit(): void {
    if (!this.isBrowser) {
      return;
    }

    // Honour any `#fragment` in the URL on initial load — Angular's own
    // anchor scrolling only works against the window, but services
    // renders inside a custom overflow-y container, so we drive the
    // scroll manually. This runs on first paint and on any later
    // fragment change (e.g. footer link click while already on /services).
    this._route.fragment.pipe(takeUntilDestroyed(this._destroyRef)).subscribe((fragment) => {
      this._scrollToFragment(fragment);
    });
  }

  protected scrollToContact(): void {
    this._scrollToFragment('contact');
  }

  private _scrollToFragment(fragment: string | null): void {
    if (!fragment) {
      return;
    }
    const target = this._document.getElementById(fragment);
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}
