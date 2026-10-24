import { extendStyles } from './extend-styles';

export function disableDragInteractions(element: HTMLElement) {
  extendStyles(element.style, {
    'touch-action': 'none',
    '-webkit-user-drag': 'none',
    '-webkit-tap-highlight-color': 'transparent',
    'user-select': 'none',
    '-ms-user-select': 'none',
    '-webkit-user-select': 'none',
    '-moz-user-select': 'none',
  });
}
