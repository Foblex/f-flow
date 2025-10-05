export type FEventTrigger = (event: FTriggerEvent) => boolean;

export type FTriggerEvent = MouseEvent | TouchEvent | WheelEvent;

export function isValidEventTrigger(event: FTriggerEvent, fTrigger: FEventTrigger): boolean {
  return fTrigger(event);
}

export function defaultEventTrigger(_event: FTriggerEvent): boolean {
  return true;
}
