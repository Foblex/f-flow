import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { CookiePopup, GTagService, IS_BROWSER_PLATFORM, ThemeService } from '@foblex/m-render';
import { PORTAL_SHELL } from '../../portal-shell';
import { Seo } from '../../core/seo';
import { Stats } from '../../core/stats';
import { StructuredData } from '../../core/structured-data';
import { PortalFooter, PortalHeader, IFooterColumn } from '../../shared';
import {
  Changelog,
  Features,
  FinalCta,
  Hero,
  HeroFlow,
  ProjectFacts,
  RefApps,
  Showcase,
  Team,
  Why,
} from './sections';

@Component({
  selector: 'home',
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CookiePopup,
    PortalHeader,
    PortalFooter,
    HeroFlow,
    Hero,
    Why,
    Features,
    Showcase,
    RefApps,
    Changelog,
    Team,
    ProjectFacts,
    FinalCta,
  ],
})
export class Home implements OnInit {
  private readonly _gTagService = inject(GTagService, { optional: true });
  private readonly _themeService = inject(ThemeService, { optional: true });
  private readonly _seo = inject(Seo);
  private readonly _structuredData = inject(StructuredData);
  private readonly _stats = inject(Stats);

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
      title: 'Foblex Flow — Angular Node-Based UI Library for Workflow Builders',
      description:
        'Angular-native library for building node editors, workflow builders, and diagram UIs. Signals, standalone components, SSR-aware. MIT licensed.',
      canonicalUrl: 'https://flow.foblex.com/',
    });

    this._publishStructuredData();

    if (!this.isBrowser) {
      return;
    }
    this._themeService?.initialize();
    this._gTagService?.initialize();
  }

  private _publishStructuredData(): void {
    const snapshot = this._stats.snapshot();
    const organization = {
      '@type': 'Organization',
      '@id': 'https://flow.foblex.com/#organization',
      name: 'Foblex',
      url: 'https://flow.foblex.com/',
      logo: 'https://flow.foblex.com/favicons/android-chrome-512x512.png',
      sameAs: ['https://github.com/Foblex/f-flow', 'https://x.com/foblexflow'],
    };

    this._structuredData.set('home-graph', {
      '@context': 'https://schema.org',
      '@graph': [
        organization,
        {
          '@type': 'SoftwareApplication',
          '@id': 'https://flow.foblex.com/#software',
          name: 'Foblex Flow',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'Web',
          offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
          ...(snapshot.version ? { softwareVersion: snapshot.version } : {}),
          license: 'https://opensource.org/licenses/MIT',
          programmingLanguage: 'TypeScript',
          runtimePlatform: 'Angular 17.3+',
          author: { '@id': 'https://flow.foblex.com/#organization' },
          description:
            'Angular-native library for node-based UIs, workflow builders, and interactive diagram editors.',
          downloadUrl: 'https://www.npmjs.com/package/@foblex/flow',
          codeRepository: 'https://github.com/Foblex/f-flow',
          url: 'https://flow.foblex.com/',
        },
      ],
    });
  }
}
