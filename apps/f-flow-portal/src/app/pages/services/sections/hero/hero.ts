import { ChangeDetectionStrategy, Component, computed, inject, output } from '@angular/core';
import { formatCount, formatVersion, Stats } from '../../../../core/stats';

interface ITrustItem {
  label: string;
  value?: string;
  labelBefore?: boolean;
}

@Component({
  selector: 'services-hero',
  templateUrl: './hero.html',
  styleUrl: './hero.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Hero {
  private readonly _stats = inject(Stats);

  public readonly contactClick = output<void>();

  /**
   * Trust row. Shared Stats service is hydrated once per SSR render
   * (1h cache) and handed to the browser via TransferState, so home
   * + services read the same live numbers without refetching on
   * navigation. Individual upstream failures fall through to the
   * defaults baked into `STATS_FALLBACK`.
   */
  protected readonly trust = computed<ITrustItem[]>(() => {
    const snapshot = this._stats.snapshot();

    return [
      { label: 'Building Foblex since', value: '2022', labelBefore: true },
      { label: 'yearly installs', value: formatCount(snapshot.yearlyInstalls) },
      { label: 'stars', value: formatCount(snapshot.stars) },
      { label: '', value: formatVersion(snapshot.version) },
    ];
  });

  protected onContact(event: Event): void {
    event.preventDefault();
    this.contactClick.emit();
  }
}
