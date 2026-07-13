const TRANSITION_END_GRACE_MS = 50;

export function transitionEnd(element: HTMLElement, callback: () => void): void {
  let completed = false;
  let fallbackTimer: ReturnType<typeof setTimeout> | null = null;

  const complete = () => {
    if (completed) {
      return;
    }
    completed = true;
    element.removeEventListener('transitionend', onTransitionFinished);
    element.removeEventListener('transitioncancel', onTransitionFinished);
    if (fallbackTimer !== null) {
      clearTimeout(fallbackTimer);
    }
    callback();
  };

  const onTransitionFinished = (event: TransitionEvent) => {
    if (event.target === element && event.propertyName === 'transform') {
      complete();
    }
  };

  element.addEventListener('transitionend', onTransitionFinished);
  element.addEventListener('transitioncancel', onTransitionFinished);

  fallbackTimer = setTimeout(complete, _transitionTimeout(element) + TRANSITION_END_GRACE_MS);
}

function _transitionTimeout(element: HTMLElement): number {
  const view = element.ownerDocument.defaultView;
  if (!view) {
    return 0;
  }

  const styles = view.getComputedStyle(element);
  const durations = _transitionTimes(styles.transitionDuration);
  const delays = _transitionTimes(styles.transitionDelay);
  const count = Math.max(durations.length, delays.length);
  let result = 0;

  for (let index = 0; index < count; index++) {
    result = Math.max(result, durations[index % durations.length] + delays[index % delays.length]);
  }

  return result;
}

function _transitionTimes(value: string): number[] {
  const times = value.split(',').map((part) => {
    const time = part.trim();
    const multiplier = time.endsWith('ms') ? 1 : 1000;
    const parsed = Number.parseFloat(time);

    return Number.isFinite(parsed) ? parsed * multiplier : 0;
  });

  return times.length ? times : [0];
}
