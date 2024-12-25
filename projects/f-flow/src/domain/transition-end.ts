export function transitionEnd(element: HTMLElement, callback: (event: TransitionEvent) => void): void {
  const onTransitionEnd = (event: TransitionEvent) => {
    if (event.propertyName === 'transform') {
      element.removeEventListener('transitionend', onTransitionEnd);
      callback(event);
    }
  };

  element.addEventListener('transitionend', onTransitionEnd);
}
