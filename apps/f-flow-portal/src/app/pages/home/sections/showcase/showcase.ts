import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { IShowcaseItem, ThemeService } from '@foblex/m-render';
import { SHOWCASE } from '../../../../../../public/showcase/showcase';
import { SectionHead } from '../../../../shared';

interface IShowcaseCard {
  title: string;
  description: string;
  image: string;
  url: string;
  tag: string;
}

/**
 * Showcase entries that duplicate content already shown in the ref-apps
 * section (AI Low-Code Platform, Schema Designer, Call Center, UML
 * Diagram) are hidden from the home page so the two sections stay
 * complementary — ref-apps shows the open-source reference implementations,
 * showcase shows real commercial products and third-party projects.
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

const HOME_SHOWCASE_COUNT = 6;

function isRefAppDuplicate(item: IShowcaseItem): boolean {
  if (REF_APP_NAME_HINTS.includes(item.name)) {
    return true;
  }

  const demoUrl = item.links?.find((link) => link.text.toLowerCase() === 'demo')?.url ?? '';

  return REF_APP_EXAMPLE_PATHS.some((path) => demoUrl.includes(path));
}

@Component({
  selector: 'home-showcase',
  templateUrl: './showcase.html',
  styleUrl: './showcase.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [SectionHead],
})
export class Showcase {
  private readonly _theme = inject(ThemeService);

  private readonly _themeChanges = toSignal(
    this._theme.theme$.pipe(
      startWith(null),
      map(() => this._theme.getPreferredTheme()),
    ),
    { initialValue: 'light' as 'light' | 'dark' },
  );

  protected readonly cards = computed<IShowcaseCard[]>(() => {
    const theme = this._themeChanges();

    return SHOWCASE.filter((item) => !isRefAppDuplicate(item))
      .slice(0, HOME_SHOWCASE_COUNT)
      .map((item) => ({
        title: item.name,
        description: item.description.trim(),
        image: theme === 'dark' ? item.imageUrlDark || item.imageUrl : item.imageUrl,
        url: item.links?.[0]?.url ?? 'https://flow.foblex.com/showcase/overview',
        tag: item.tags?.[0] ?? '',
      }));
  });
}
