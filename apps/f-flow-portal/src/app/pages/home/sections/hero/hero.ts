import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IS_BROWSER_PLATFORM } from '@foblex/m-render';
import { formatCount, formatVersion, Stats } from '../../../../core/stats';
import { SHOWCASE } from '../../../../../../public/showcase/showcase';
import { HeroFlowAnchor } from '../hero-flow-anchor';

interface IStat {
  value: string;
  label?: string;
}

interface IProductionProduct {
  name: string;
  url: string;
}

/**
 * Commercial products for the hero proof strip, derived from the showcase:
 * an entry qualifies when it links to an external product website. A short
 * brand in trailing parentheses wins over the long showcase name, so
 * "Agents Platform (XpertAI)" renders as "XpertAI". Adding a product to
 * SHOWCASE updates this strip automatically — no per-item assets here.
 */
const PRODUCTION_PRODUCTS: IProductionProduct[] = SHOWCASE.flatMap((item) => {
  const website = item.links?.find((link) => link.text === 'Website');

  if (!website) {
    return [];
  }

  const shortName = item.name.match(/\(([^)]+)\)\s*$/u)?.[1] ?? item.name;

  return [{ name: shortName, url: website.url }];
});

@Component({
  selector: 'home-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, HeroFlowAnchor],
})
export class Hero {
  private readonly _document = inject(DOCUMENT);
  private readonly _isBrowser = inject(IS_BROWSER_PLATFORM);
  private readonly _stats = inject(Stats);

  protected readonly copied = signal(false);

  protected readonly stats = computed<IStat[]>(() => {
    const snapshot = this._stats.snapshot();

    return [
      { value: formatCount(snapshot.stars), label: 'stars' },
      { value: formatCount(snapshot.weeklyInstalls), label: 'weekly installs' },
      { value: formatVersion(snapshot.version) },
      { value: snapshot.license },
    ];
  });

  protected readonly installCommand = 'ng add @foblex/flow';

  protected readonly productionProducts = PRODUCTION_PRODUCTS;

  protected copyInstall(): void {
    if (!this._isBrowser) {
      return;
    }
    navigator.clipboard?.writeText(this.installCommand).catch(() => undefined);
    this.copied.set(true);
    this._document.defaultView?.setTimeout(() => this.copied.set(false), 1200);
  }
}
