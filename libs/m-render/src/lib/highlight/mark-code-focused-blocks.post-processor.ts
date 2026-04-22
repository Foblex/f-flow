import { Observable, of } from 'rxjs';

export class MarkCodeFocusedBlocksPostProcessor {
  constructor(private _window: Window) {}

  public handle(element: HTMLElement): Observable<HTMLElement> {
    const html = element.innerHTML;
    if (!html.includes(FOCUS_OPEN_MARKER)) {
      return of(element);
    }

    element.innerHTML = this._markFocusedBlocks(html);

    const focused = element.querySelector('.focused');
    const hostElement = element.parentElement;
    if (focused && hostElement) {
      this._applyOpacity(hostElement);
    }

    return of(element);
  }

  private _applyOpacity(element: HTMLElement) {
    if (!element.classList.contains('focused')) {
      element.style.color = this._createRgbaString(this._getElementColor(element), 0.5);
      element.childNodes.forEach((child) => {
        if (child.nodeType === Node.ELEMENT_NODE) {
          this._applyOpacity(child as HTMLElement);
        }
      });
    } else {
      element.style.color = this._createRgbaString(this._getElementColor(element), 1, true);
    }
  }

  private _getElementColor(element: HTMLElement): string {
    return this._window.getComputedStyle(element).color;
  }

  private _createRgbaString(color: string, opacity: number, isRgb = false): string {
    const [r, g, b, a] = this._getRgbValues(color);
    const alpha = Number(a) || 1;

    return isRgb ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${opacity * alpha})`;
  }

  private _getRgbValues(color: string): [string, string, string, string] {
    const matches = color.match(/-?\d*\.?\d+/g) || [];
    const [r = '0', g = '0', b = '0', a = '1'] = matches;

    return [r, g, b, a];
  }

  private _markFocusedBlocks(html: string): string {
    let result = '';
    let cursor = 0;

    while (cursor < html.length) {
      const start = html.indexOf(FOCUS_OPEN_MARKER, cursor);
      if (start === -1) {
        result += html.slice(cursor);
        break;
      }

      const contentStart = start + FOCUS_OPEN_MARKER.length;
      const end = html.indexOf(FOCUS_CLOSE_MARKER, contentStart);
      if (end === -1) {
        result += html.slice(cursor);
        break;
      }

      result += html.slice(cursor, start);
      result += `<focus class="focused"><div class="inline-focus">${html.slice(contentStart, end)}</div></focus>`;
      cursor = end + FOCUS_CLOSE_MARKER.length;
    }

    return result;
  }
}

const FOCUS_OPEN_MARKER = 'ƒƒƒ';
const FOCUS_CLOSE_MARKER = '¢¢¢';
