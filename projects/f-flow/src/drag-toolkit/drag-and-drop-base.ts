import { ICanRunOutsideAngular } from './i-can-run-outside-angular';
import {
  IMouseEvent,
  IPointerEvent,
  IPointerUpEvent,
  ITouchDownEvent,
  ITouchMoveEvent,
} from './pointer-events';
import { EventExtensions } from './event.extensions';

export const MOUSE_EVENT_IGNORE_TIME = 800;

/**
 * Base class for implementing drag and drop functionality.
 * It handles mouse and touch events, manages the drag start sequence,
 * and provides abstract methods for derived classes to implement specific behaviors.
 */
export abstract class DragAndDropBase {

  public abstract hostElement: HTMLElement;

  private document: Document | undefined;

  private mouseListeners: Function = EventExtensions.emptyListener();
  private touchListeners: Function = EventExtensions.emptyListener();

  private startListeners: Function = EventExtensions.emptyListener();

  public isSyntheticEvent(event: MouseEvent): boolean {
    return !!this.lastTouchEventTime &&
      (this.lastTouchEventTime + MOUSE_EVENT_IGNORE_TIME > Date.now());
  }

  private lastTouchEventTime: number = 0;

  public isDragStarted: boolean = false;
  private dragStartThreshold: number = 3;
  private dragStartDelay: number = 0;

  private dragStartTime: number = 0;
  private dragStartPosition: { x: number, y: number } = { x: 0, y: 0 };

  public abstract disabled: boolean;

  private moveHandler: Function = this.checkDragSequenceToStart;

  private pointerDownElement: HTMLElement | null = null;

  protected constructor(
    protected ngZone: ICanRunOutsideAngular | undefined,
  ) {
  }

  /**
   * Handles the mouse down event to initiate the drag sequence.
   * It checks if the event is synthetic or fake, and if the drag is already started.
   * If not, it sets up the drag start sequence by adding necessary event listeners.
   * @param event - The mouse event that triggered the drag.
   */
  private onMouseDown = (event: MouseEvent) => {
    const isSyntheticEvent = this.isSyntheticEvent(event);
    const isFakeEvent = isFakeMousedownFromScreenReader(event);
    const mouseEvent = new IMouseEvent(event);

    if (isSyntheticEvent || isFakeEvent || this.disabled || this.isDragStarted) {
      return;
    }
    this.pointerDownElement = mouseEvent.targetElement;
    const result = this.onPointerDown(mouseEvent);
    if (result) {

      this.dragStartTime = Date.now();
      this.dragStartPosition = mouseEvent.getPosition();

      this.ngZone?.runOutsideAngular(() => {
        this.document?.addEventListener('selectstart', this.onSelectStart, EventExtensions.activeListener());
        this.document?.addEventListener('mousemove', this.onMouseMove);
        this.document?.addEventListener('pointerup', this.onPointerUpEvent);
        this.document?.addEventListener('pointercancel', this.onPointerUpEvent, EventExtensions.activeCaptureListener());
        this.document?.addEventListener('contextmenu', this.onContextMenuDuringDrag, EventExtensions.activeCaptureListener());
      });

      this.mouseListeners = () => {
        this.document?.removeEventListener('selectstart', this.onSelectStart, EventExtensions.activeListener());
        this.document?.removeEventListener('mousemove', this.onMouseMove);
        this.document?.removeEventListener('pointerup', this.onPointerUpEvent);
        this.document?.removeEventListener('pointercancel', this.onPointerUpEvent, EventExtensions.activeCaptureListener());
        this.document?.removeEventListener('contextmenu', this.onContextMenuDuringDrag, EventExtensions.activeCaptureListener());
      };
    }
  }

  /**
   * Handles the touch down event to initiate the drag sequence.
   * It checks if the event is synthetic or fake, and if the drag is already started.
   * If not, it sets up the drag start sequence by adding necessary event listeners.
   * @param event - The touch event that triggered the drag.
   */
  private onTouchDown = (event: TouchEvent) => {
    const isFakeEvent = isFakeTouchstartFromScreenReader(event as TouchEvent)
    const touchEvent = new ITouchDownEvent(event);

    if (isFakeEvent || this.disabled || this.isDragStarted) {
      return;
    }
    this.pointerDownElement = touchEvent.targetElement;
    const result = this.onPointerDown(touchEvent);
    if (result) {

      this.dragStartTime = Date.now();
      this.dragStartPosition = touchEvent.getPosition();

      this.ngZone?.runOutsideAngular(() => {
        this.document?.addEventListener('selectstart', this.onSelectStart, EventExtensions.activeListener());
        this.document?.addEventListener('touchmove', this.onTouchMove);
        this.document?.addEventListener('pointerup', this.onPointerUpEvent);
        this.document?.addEventListener('pointercancel', this.onPointerUpEvent, EventExtensions.activeCaptureListener());
        this.document?.addEventListener('contextmenu', this.onContextMenuDuringDrag, EventExtensions.activeCaptureListener());
      });

      this.touchListeners = () => {
        this.document?.removeEventListener('selectstart', this.onSelectStart, EventExtensions.activeListener());
        this.document?.removeEventListener('touchmove', this.onTouchMove);
        this.document?.removeEventListener('pointerup', this.onPointerUpEvent);
        this.document?.removeEventListener('pointercancel', this.onPointerUpEvent, EventExtensions.activeCaptureListener());
        this.document?.removeEventListener('contextmenu', this.onContextMenuDuringDrag, EventExtensions.activeCaptureListener());
      };
    }
  }

  /**
   * Handles the select start event.
   * This method is called when the user starts selecting text or elements.
   * It prevents the default behavior and calls the onSelect method to handle the selection.
   * @param event - The event that triggered the select start.
   */
  private onSelectStart = (event: Event) => {
    this.onSelect(event);
  }

  /**
   * Handles the mouse move event during the drag sequence.
   * It checks if the drag sequence should start and calls the move handler accordingly.
   * @param event - The mouse event that triggered the move.
   */
  private onMouseMove = (event: MouseEvent) => {
    this.moveHandler(new IMouseEvent(event));
  }

  /**
   * Handles the touch move event during the drag sequence.
   * It checks if the drag sequence should start and calls the move handler accordingly.
   * @param event - The touch event that triggered the move.
   */
  private onTouchMove = (event: TouchEvent) => {
    this.moveHandler(new ITouchMoveEvent(event));
  }

  /**
   * Checks if the drag sequence should start based on the pointer position.
   * It compares the current pointer position with the initial drag start position
   * and checks if the distance exceeds the drag start threshold.
   * If the threshold is exceeded and the delay has passed,
   * it prepares the drag sequence and sets the move handler to onPointerMove.
   * @param event - The pointer event that triggered the check.
   */
  private checkDragSequenceToStart(event: IPointerEvent): void {
    const pointerPosition = event.getPosition();

    if (!this.isDragStarted && this.pointerDownElement) {
      event.setTarget(this.pointerDownElement);
      const distanceX = Math.abs(pointerPosition.x - this.dragStartPosition.x);
      const distanceY = Math.abs(pointerPosition.y - this.dragStartPosition.y);
      const isOverThreshold = distanceX + distanceY >= this.dragStartThreshold;

      if (isOverThreshold) {
        const isDelayElapsed = Date.now() >= this.dragStartTime + this.dragStartDelay;

        if (!isDelayElapsed) {
          this.endDragSequence();

          return;
        }

        event.preventDefault();
        this.prepareDragSequence(event);
        this.isDragStarted = true;
        this.moveHandler = this.onPointerMove;
        if (isTouchEvent(event.originalEvent)) {
          this.lastTouchEventTime = Date.now();
        }
      }
    }
  }

  /**
   * Prepares the drag sequence by setting up necessary event listeners
   * and initializing any required state for the drag operation.
   * This method should be implemented by derived classes to define specific drag behavior.
   * @param event - The pointer event that triggered the preparation.
   */
  protected abstract prepareDragSequence(event: IPointerEvent): void;

  /**
   * Handles the pointer up event at the end of the drag sequence.
   * It checks if the drag has started and calls the onPointerUp method.
   * It also ends the drag sequence by resetting the state and removing event listeners.
   * This method is called when the user releases the mouse button or lifts their finger from the touch screen.
   * @param event - The pointer event that triggered the up action.
   */
  private onPointerUpEvent = (event: PointerEvent) => {
    if (this.isDragStarted) {
      this.onPointerUp(new IPointerUpEvent(event));
    }
    this.endDragSequence();
  }

  /**
   * Ends the drag sequence by resetting the state and removing event listeners.
   * It sets the isDragStarted flag to false, clears the pointerDownElement,
   * and resets the moveHandler to checkDragSequenceToStart.
   * It also removes all mouse and touch event listeners that were added during the drag sequence.
   */
  private endDragSequence(): void {
    this.isDragStarted = false;
    this.pointerDownElement = null;

    this.moveHandler = this.checkDragSequenceToStart;
    this.mouseListeners();
    this.mouseListeners = EventExtensions.emptyListener();
    this.touchListeners();
    this.touchListeners = EventExtensions.emptyListener();
    this.finalizeDragSequence();
  }

  protected abstract finalizeDragSequence(): void;

  protected abstract onSelect(event: Event): void;

  public abstract onPointerDown(event: IPointerEvent): boolean;

  public abstract onPointerMove(event: IPointerEvent): void;

  public abstract onPointerUp(event: IPointerEvent): void;

  public subscribe(fDocument: Document): void {
    if (this.document) {
      this.unsubscribe();
    }
    this.document = fDocument;

    this.ngZone?.runOutsideAngular(() => {
      fDocument.addEventListener('mousedown', this.onMouseDown, EventExtensions.activeListener());
      fDocument.addEventListener('touchstart', this.onTouchDown, EventExtensions.passiveListener());
    });

    this.startListeners = () => {
      fDocument.removeEventListener('mousedown', this.onMouseDown, EventExtensions.activeListener());
      fDocument.removeEventListener('touchstart', this.onTouchDown, EventExtensions.passiveListener());
    };
  }

  public unsubscribe(): void {

    this.startListeners();
    this.startListeners = EventExtensions.emptyListener();
    this.touchListeners();
    this.touchListeners = EventExtensions.emptyListener();
    this.mouseListeners();
    this.mouseListeners = EventExtensions.emptyListener();
  }

  private onContextMenuDuringDrag = (e: Event) => {
    if (this.isDragStarted) {
      e.preventDefault();
    }
  };
}

function isTouchEvent(event: MouseEvent | TouchEvent): event is TouchEvent {
  return event.type[0] === 't';
}

function isFakeMousedownFromScreenReader(event: MouseEvent): boolean {
  return event.buttons === 0 || (event.offsetX === 0 && event.offsetY === 0);
}

function isFakeTouchstartFromScreenReader(event: TouchEvent): boolean {
  const touch: Touch | undefined =
    (event.touches && event.touches[0]) || (event.changedTouches && event.changedTouches[0]);

  return (
    !!touch &&
    touch.identifier === -1 &&
    (touch.radiusX == null || touch.radiusX === 1) &&
    (touch.radiusY == null || touch.radiusY === 1)
  );
}
