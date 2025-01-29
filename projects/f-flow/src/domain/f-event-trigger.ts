export type FEventTrigger = (event: TriggerEvent) => boolean;

export type TriggerEvent = MouseEvent | TouchEvent | WheelEvent;

export function isValidEventTrigger(event: TriggerEvent, fTrigger: FEventTrigger): boolean {
  return fTrigger(event);
}

export function defaultEventTrigger(event: TriggerEvent): boolean {
  return true;
}
