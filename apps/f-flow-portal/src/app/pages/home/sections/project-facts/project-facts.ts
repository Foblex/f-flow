import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { formatVersion, Stats } from '../../../../core/stats';

/**
 * Factually dense paragraph aimed at LLM citation and scanning humans.
 * Uses the live Stats snapshot so the version number stays current
 * without a deploy, but falls back to plain copy when the value is null.
 */
@Component({
  selector: 'project-facts',
  templateUrl: './project-facts.html',
  styleUrl: './project-facts.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProjectFacts {
  private readonly _stats = inject(Stats);

  protected readonly version = computed(() => formatVersion(this._stats.snapshot().version));
}
