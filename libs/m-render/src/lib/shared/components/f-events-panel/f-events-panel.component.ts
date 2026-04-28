import { booleanAttribute, ChangeDetectionStrategy, Component, input } from '@angular/core';

export interface IFEventLogEntry {
  /** Timestamp in display format, e.g. `12:04:01.230`. */
  timestamp: string;
  /** Event name, e.g. `selectionChange`. */
  name: string;
  /** Optional payload preview, e.g. `node1out → node2in`. */
  value?: string;
}

/**
 * Floating events drawer for example pages that emit a small stream of
 * lifecycle events (selection, connection, etc). Sits as a glass card in
 * the corner of the canvas, alongside the toolbar; pass an `events`
 * array or project custom rows via content.
 */
@Component({
  selector: 'f-events-panel',
  standalone: true,
  templateUrl: './f-events-panel.component.html',
  styleUrl: './f-events-panel.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    // See FToolbarComponent — opts the panel out of canvas drag gestures
    // so scrolling or selecting log text doesn't start a marquee.
    class: 'f-drag-blocker',
    '[class.align-top]': 'alignTop()',
  },
})
export class FEventsPanelComponent {
  /** Display title shown in the drawer header. Defaults to `Events`. */
  public readonly title = input<string>('Events');

  public readonly alignTop = input<boolean, unknown>(false, { transform: booleanAttribute });

  /**
   * Bound event entries. Newest entries should sit first; the panel
   * itself does not sort or mutate the array — it just renders it.
   */
  public readonly events = input<IFEventLogEntry[]>([]);
}
