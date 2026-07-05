export type FEventTrigger = (event: FTriggerEvent) => boolean;

export type FTriggerEvent = MouseEvent | TouchEvent | WheelEvent;

export function isValidEventTrigger(event: FTriggerEvent, fTrigger: FEventTrigger): boolean {
  return fTrigger(event);
}

export function defaultEventTrigger(_event: FTriggerEvent): boolean {
  return true;
}

/**
 * Bit for the primary (usually left) button in `MouseEvent.buttons`.
 * Using `buttons` (not `button`) works both on `pointerdown` and on the `pointermove`
 * that crosses the drag threshold, where `button` is unreliable.
 */
const PRIMARY_BUTTON_BIT = 1;
/** Bit for the middle (wheel) button in `MouseEvent.buttons`. */
const MIDDLE_BUTTON_BIT = 4;

/** Trigger that passes for touch input and for the primary (left) mouse button. */
export function primaryButtonEventTrigger(event: FTriggerEvent): boolean {
  if (!('buttons' in event)) {
    return true;
  }
  const buttons = (event as MouseEvent).buttons;

  return buttons === 0 ? true : (buttons & PRIMARY_BUTTON_BIT) === PRIMARY_BUTTON_BIT;
}

/** Trigger that passes while the middle (wheel) mouse button is pressed. */
export function middleButtonEventTrigger(event: FTriggerEvent): boolean {
  return (
    'buttons' in event && ((event as MouseEvent).buttons & MIDDLE_BUTTON_BIT) === MIDDLE_BUTTON_BIT
  );
}
