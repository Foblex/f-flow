export interface IFActionTrigger<TAction = string, TEvent = Event> {

  event: EFTriggerEvent;

  action: TAction;

  validator?: (event: TEvent) => boolean;
}

export enum EFTriggerEvent {
  WHEEL = 'wheel',
  DOUBLE_CLICK = 'dblclick',
  MOUSE_DOWN = 'mousedown',
  MOUSE_UP = 'mouseup',
  MOUSE_MOVE = 'mousemove',
  KEY_DOWN = 'keydown',
  KEY_UP = 'keyup'
}
