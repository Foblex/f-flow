import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { IShowcaseItem, ThemeService } from '@foblex/m-render';
import { SHOWCASE } from '../../../../../../public/showcase/showcase';
import { SectionHead } from '../../../../shared';

interface ICaseCard {
  title: string;
  description: string;
  image: string;
  url: string;
  tag: string;
}

/**
 * The services "cases" section surfaces the same third-party /
 * commercial projects the home-showcase section promotes — not the
 * first-party reference apps from home-ref-apps. Keeping the two pages
 * in sync means visitors see "real products" as consistently defined
 * across the portal. Ref-app examples are filtered out via the same
 * rule the home showcase uses.
 */
const REF_APP_EXAMPLE_PATHS = [
  '/examples/ai-low-code-platform',
  '/examples/schema-designer',
  '/examples/call-center',
  '/examples/uml-diagram-example',
];

const REF_APP_NAME_HINTS = [
  'AI Low Code Platform',
  'AI Low-Code Platform',
  'Schema Designer',
  'Call Center Automation Platform',
  'UML Diagram',
];

const SERVICES_CASES_COUNT = 3;

function isRefAppDuplicate(item: IShowcaseItem): boolean {
  if (REF_APP_NAME_HINTS.includes(item.name)) {
    return true;
  }

  const demoUrl = item.links?.find((link) => link.text.toLowerCase() === 'demo')?.url ?? '';

  return REF_APP_EXAMPLE_PATHS.some((path) => demoUrl.includes(path));
}

@Component({
  selector: 'services-cases',
  templateUrl: './cases.html',
  styleUrl: './cases.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHead],
})
export class Cases {
  private readonly _theme = inject(ThemeService);

  private readonly _themeChanges = toSignal(
    this._theme.theme$.pipe(
      startWith(null),
      map(() => this._theme.getPreferredTheme()),
    ),
    { initialValue: 'light' as 'light' | 'dark' },
  );

  protected readonly cases = computed<ICaseCard[]>(() => {
    const theme = this._themeChanges();

    return SHOWCASE.filter((item) => !isRefAppDuplicate(item))
      .slice(0, SERVICES_CASES_COUNT)
      .map((item) => ({
        title: item.name,
        description: item.description.trim(),
        image: theme === 'dark' ? item.imageUrlDark || item.imageUrl : item.imageUrl,
        url: item.links?.[0]?.url ?? 'https://flow.foblex.com/showcase/overview',
        tag: item.tags?.[0] ?? '',
      }));
  });
}
