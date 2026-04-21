import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterLink } from '@angular/router';
import { IS_BROWSER_PLATFORM } from '@foblex/m-render';
import { formatCount, formatVersion, Stats } from '../../../../core/stats';
import { HeroFlowAnchor } from '../hero-flow-anchor';

interface IStat {
  value: string;
  label?: string;
}

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

  protected copyInstall(): void {
    if (!this._isBrowser) {
      return;
    }
    navigator.clipboard?.writeText(this.installCommand).catch(() => undefined);
    this.copied.set(true);
    this._document.defaultView?.setTimeout(() => this.copied.set(false), 1200);
  }
}
