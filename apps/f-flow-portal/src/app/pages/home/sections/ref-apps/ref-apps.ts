import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, startWith } from 'rxjs';
import { RouterLink } from '@angular/router';
import { ThemeService } from '@foblex/m-render';
import { SectionHead } from '../../../../shared';

interface IRefAppSource {
  title: string;
  description: string;
  routerLink: string;
  imageLight: string;
  imageDark: string;
}

interface IRefApp {
  title: string;
  description: string;
  routerLink: string;
  image: string;
}

/**
 * Reference apps that ship with source and are routed on the portal.
 * Kept in sync with entries in `examples-config.ts`. Router links go
 * straight to the live-rendered example so visitors skip the
 * examples index.
 */
const REF_APPS: IRefAppSource[] = [
  {
    title: 'AI Low-Code Platform',
    description:
      'Front-end-only AI low-code IDE with custom nodes, JSON import/export, right-side config panels, validation reflected on nodes, undo/redo, persistence, and animated connections.',
    routerLink: '/examples/ai-low-code-platform',
    imageLight: './previews/examples/ai-low-code.light.png',
    imageDark: './previews/examples/ai-low-code.dark.png',
  },
  {
    title: 'Schema Designer',
    description:
      'Interactive schema modeler with table nodes, inline column editing, relation toolbars, context menus, selection area, and minimap.',
    routerLink: '/examples/schema-designer',
    imageLight: './previews/examples/db-management-flow.light.png',
    imageDark: './previews/examples/db-management-flow.dark.png',
  },
  {
    title: 'Call Center Flow',
    description:
      'Call-center flow builder with IVR branches, schedule checks, queueing, operator handoff, transfer, voicemail, palette-driven node creation, and minimap navigation.',
    routerLink: '/examples/call-center',
    imageLight: './previews/examples/call-center.light.png',
    imageDark: './previews/examples/call-center.dark.png',
  },
  {
    title: 'UML Diagram',
    description:
      'Layered UML surface with package groups, relation filters, search, custom markers, details panel, and viewport controls.',
    routerLink: '/examples/uml-diagram-example',
    imageLight: './previews/examples/uml-diagram-example.light.png',
    imageDark: './previews/examples/uml-diagram-example.dark.png',
  },
];

@Component({
  selector: 'home-ref-apps',
  templateUrl: './ref-apps.html',
  styleUrl: './ref-apps.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterLink, SectionHead],
})
export class RefApps {
  private readonly _theme = inject(ThemeService);

  private readonly _themeChanges = toSignal(
    this._theme.theme$.pipe(
      startWith(null),
      map(() => this._theme.getPreferredTheme()),
    ),
    { initialValue: 'light' as 'light' | 'dark' },
  );

  protected readonly cards = computed<IRefApp[]>(() => {
    const theme = this._themeChanges();

    return REF_APPS.map((entry) => ({
      title: entry.title,
      description: entry.description,
      routerLink: entry.routerLink,
      image: theme === 'dark' ? entry.imageDark : entry.imageLight,
    }));
  });
}
