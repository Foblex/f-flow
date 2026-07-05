import { InjectionToken } from '@angular/core';

/**
 * Every string the accessibility layer speaks or attaches to the DOM, as a keyed
 * catalog. Override any subset via `withA11y({ messages })` to localize or reword —
 * announcements go through a live region (WCAG 4.1.3), so their language matters as
 * much as visible text.
 */
export interface IFA11yMessages {
  /** `aria-roledescription` of the `f-flow` host — the widget's entry point. */
  flow: string;
  /** `aria-roledescription` of a node element. */
  node: string;
  /** `aria-roledescription` of a group element. */
  group: string;
  /** `aria-roledescription` of a connection element. */
  connection: string;
  /** Standing keyboard instructions attached to the host via `aria-describedby`. */
  instructions: string;
  /** Accessible name of a connection between two endpoints. */
  connectionLabel(sourceId: string, targetId: string): string;
  /** Announced when focus (and selection) lands on a node. */
  nodeFocused(label: string, index: number, total: number): string;
  /** Announced when focus (and selection) lands on a connection. */
  connectionFocused(label: string): string;
  /** Announced after select-all. */
  allSelected(count: number): string;
  /** Announced when the selection is cleared. */
  selectionCleared: string;
  /** Collective label for a multi-item grab/drop announcement ("4 items"). */
  itemsCount(count: number): string;
  /** Announced when the selection is grabbed for keyboard movement. */
  grabbed(label: string): string;
  /** Announced while a grabbed node moves. */
  moved(x: number, y: number): string;
  /** Announced when a grabbed node is dropped. */
  dropped(label: string, x: number, y: number): string;
  /** Announced when keyboard movement is cancelled and the node is returned. */
  moveCancelled(label: string): string;
  /** Announced when a keyboard connection starts from a source. */
  connectStarted(sourceLabel: string): string;
  /** Announced for each candidate target while cycling. */
  connectTarget(label: string, index: number, total: number): string;
  /** Announced when a keyboard connection is committed. */
  connected(sourceLabel: string, targetLabel: string): string;
  /** Announced when the keyboard connection is cancelled. */
  connectCancelled: string;
  /** Announced when there is nothing to connect from or to. */
  connectUnavailable: string;
  /** Announced when `C` is pressed with anything but exactly one node selected. */
  connectRequiresSingleNode: string;
  /** Announced when `Delete`/`Backspace` requests removal of the current selection. */
  deleteRequested(count: number): string;
  /** Announced when the zoom level changes via keyboard. */
  zoom(percent: number): string;
}

/** The English default catalog; spread it to override a subset in custom configs. */
export const F_DEFAULT_A11Y_MESSAGES: IFA11yMessages = {
  flow: 'flow diagram',
  node: 'node',
  group: 'group',
  connection: 'connection',
  instructions:
    'Use arrow keys to move between nodes (hold Shift to extend the selection), ' +
    'Control and an arrow key to follow connections. Hold Space and use arrows to move ' +
    'the selection (release to drop), or tap Space to grab and tap again to drop. ' +
    'C starts a connection, Delete removes the selection, Escape clears or cancels.',
  connectionLabel: (sourceId, targetId) => `Connection from ${sourceId} to ${targetId}`,
  nodeFocused: (label, index, total) => `${label}, ${index} of ${total}`,
  connectionFocused: (label) => label,
  allSelected: (count) => `${count} items selected`,
  selectionCleared: 'Selection cleared',
  itemsCount: (count) => `${count} items`,
  grabbed: (label) =>
    `${label} grabbed. Use arrow keys to move, drop with Space, cancel with Escape`,
  moved: (x, y) => `${x}, ${y}`,
  dropped: (label, x, y) => `${label} dropped at ${x}, ${y}`,
  moveCancelled: (label) => `Movement cancelled, ${label} returned to original position`,
  connectStarted: (sourceLabel) =>
    `Connecting from ${sourceLabel}. Use arrow keys to choose a target, Enter to connect, Escape to cancel`,
  connectTarget: (label, index, total) => `${label}, target ${index} of ${total}`,
  connected: (sourceLabel, targetLabel) => `Connected ${sourceLabel} to ${targetLabel}`,
  connectCancelled: 'Connection cancelled',
  connectUnavailable: 'No connectable target available',
  connectRequiresSingleNode: 'Select a single node to start a connection',
  deleteRequested: (count) => `Delete requested for ${count} items`,
  zoom: (percent) => `Zoom ${percent}%`,
};

/**
 * Key bindings of the keyboard layer, as `KeyboardEvent.key` values per action.
 * Single characters match case-insensitively; an empty array disables the action.
 * Arrows, `Enter` and `Escape` are structural and stay fixed.
 */
export interface IFA11yKeys {
  /** Grab/drop the selection for arrow-key movement. Default `[' ']` (Space). */
  grab?: string[];
  /** Start a keyboard connection from the selected node. Default `['c']`. */
  connect?: string[];
  /** Emit `fDeleteSelected` for the current selection. Default `['Delete', 'Backspace']`. */
  deleteSelected?: string[];
  /** Select all (requires `Ctrl`/`Cmd`). Default `['a']`. */
  selectAll?: string[];
  /** Zoom in. Default `['+', '=']`. */
  zoomIn?: string[];
  /** Zoom out. Default `['-', '_']`. */
  zoomOut?: string[];
  /** Reset zoom. Default `['0']`. */
  zoomReset?: string[];
}

/** Configuration accepted by `withA11y(...)`. */
export interface IFA11yConfig {
  /**
   * Master switch for the keyboard layer (navigation, selection, movement, connection,
   * zoom keys). Defaults to `true` once `withA11y(...)` is installed; WITHOUT the
   * feature the keyboard layer stays off, so existing apps with their own key handling
   * are never double-driven. The semantic layer (roles, names, live region) is always on.
   */
  keyboard?: boolean;

  /** Step in canvas units for keyboard node movement. Default `10`. */
  moveStep?: number;

  /** Step for `Shift`+arrow keyboard node movement. Default `50`. */
  coarseMoveStep?: number;

  /** Overrides for the spoken/attached strings — see {@link IFA11yMessages}. */
  messages?: Partial<IFA11yMessages>;

  /** Key binding overrides per action — see {@link IFA11yKeys}. */
  keys?: IFA11yKeys;
}

/** `IFA11yConfig` with defaults applied — what the accessibility layer consumes. */
export interface IFA11yResolvedConfig {
  keyboard: boolean;
  moveStep: number;
  coarseMoveStep: number;
  messages: IFA11yMessages;
  keys: Required<IFA11yKeys>;
}

/** The default action-to-keys map of the keyboard layer. */
export const F_DEFAULT_A11Y_KEYS: Required<IFA11yKeys> = {
  grab: [' '],
  connect: ['c'],
  deleteSelected: ['Delete', 'Backspace'],
  selectAll: ['a'],
  zoomIn: ['+', '='],
  zoomOut: ['-', '_'],
  zoomReset: ['0'],
};

/** Applies the defaults to a partial config; `withA11y(...)` provides the result. */
export function mergeA11yConfig(config: IFA11yConfig | null | undefined): IFA11yResolvedConfig {
  return {
    keyboard: config?.keyboard ?? true,
    moveStep: config?.moveStep ?? 10,
    coarseMoveStep: config?.coarseMoveStep ?? 50,
    messages: { ...F_DEFAULT_A11Y_MESSAGES, ...config?.messages },
    keys: { ...F_DEFAULT_A11Y_KEYS, ...config?.keys },
  };
}

/**
 * The configuration used when `withA11y(...)` is absent: semantics only. The keyboard
 * layer is strictly opt-in — every pre-a11y f-flow app ships its own key handling, and
 * a default-on layer would double-drive selection and deletion in all of them.
 */
export const F_DEFAULT_A11Y_CONFIG: IFA11yResolvedConfig = {
  ...mergeA11yConfig(undefined),
  keyboard: false,
};

/** Token holding the resolved configuration installed by `withA11y(...)`. */
export const F_A11Y_CONFIG = new InjectionToken<IFA11yResolvedConfig>('F_A11Y_CONFIG');
