import {
  IMouseEvent,
  IPointerEvent,
  IPointerUpEvent,
  ITouchDownEvent,
  ITouchMoveEvent,
} from './pointer-events';
import { EventExtensions } from './event.extensions';
import { inject, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';

export const MOUSE_EVENT_IGNORE_TIME = 800;

/**
 * Base class for implementing drag and drop functionality.
 * It handles mouse and touch events, manages the drag start sequence,
 * and provides abstract methods for derived classes to implement specific behaviors.
 */
export abstract class DragAndDropBase {
  private readonly _document = inject(DOCUMENT);
  private readonly _ngZone = inject(NgZone, { optional: true });

  private _mouseListeners = EventExtensions.emptyListener();
  private _touchListeners = EventExtensions.emptyListener();

  private _startListeners = EventExtensions.emptyListener();

  public isSyntheticEvent(_event: MouseEvent): boolean {
    return (
      !!this._lastTouchEventTime && this._lastTouchEventTime + MOUSE_EVENT_IGNORE_TIME > Date.now()
    );
  }

  private _lastTouchEventTime: number = 0;

  public isDragStarted: boolean = false;
  private _dragStartThreshold: number = 3;
  private _dragStartDelay: number = 0;

  private _dragStartTime: number = 0;
  private _dragStartPosition: { x: number; y: number } = { x: 0, y: 0 };

  public abstract disabled: boolean;

  private _moveHandler = this._checkDragSequenceToStart;

  private _pointerDownElement: HTMLElement | null = null;

  /**
   * Handles the mouse down event to initiate the drag sequence.
   * It checks if the event is synthetic or fake, and if the drag is already started.
   * If not, it sets up the drag start sequence by adding necessary event listeners.
   * @param event - The mouse event that triggered the drag.
   */
  private _onMouseDown = (event: MouseEvent) => {
    const isSyntheticEvent = this.isSyntheticEvent(event);
    const isFakeEvent = isFakeMousedownFromScreenReader(event);
    const mouseEvent = new IMouseEvent(event);

    if (isSyntheticEvent || isFakeEvent || this.disabled || this.isDragStarted) {
      return;
    }
    this._pointerDownElement = mouseEvent.targetElement;
    const result = this.onPointerDown(mouseEvent);
    if (result) {
      this._dragStartTime = Date.now();
      this._dragStartPosition = mouseEvent.getPosition();

      this._ngZone?.runOutsideAngular(() => {
        this._listen('selectstart', this._onSelectStart, EventExtensions.activeListener());
        this._listen('mousemove', this._onMouseMove);
        this._listen('pointerup', this._onPointerUpEvent);
        this._listen(
          'pointercancel',
          this._onPointerUpEvent,
          EventExtensions.activeCaptureListener(),
        );
        this._listen(
          'contextmenu',
          this._preventDuringDrag,
          EventExtensions.activeCaptureListener(),
        );
      });

      this._mouseListeners = () => {
        this._unlisten('selectstart', this._onSelectStart, EventExtensions.activeListener());
        this._unlisten('mousemove', this._onMouseMove);
        this._unlisten('pointerup', this._onPointerUpEvent);
        this._unlisten(
          'pointercancel',
          this._onPointerUpEvent,
          EventExtensions.activeCaptureListener(),
        );
        this._unlisten(
          'contextmenu',
          this._preventDuringDrag,
          EventExtensions.activeCaptureListener(),
        );
      };
    }
  };

  /**
   * Handles the touch down event to initiate the drag sequence.
   * It checks if the event is synthetic or fake, and if the drag is already started.
   * If not, it sets up the drag start sequence by adding necessary event listeners.
   * @param event - The touch event that triggered the drag.
   */
  private _onTouchDown = (event: TouchEvent) => {
    const isFakeEvent = isFakeTouchstartFromScreenReader(event as TouchEvent);
    const touchEvent = new ITouchDownEvent(event);

    if (isFakeEvent || this.disabled || this.isDragStarted) {
      return;
    }
    this._pointerDownElement = touchEvent.targetElement;
    const result = this.onPointerDown(touchEvent);
    if (result) {
      this._dragStartTime = Date.now();
      this._dragStartPosition = touchEvent.getPosition();

      this._ngZone?.runOutsideAngular(() => {
        this._listen('selectstart', this._onSelectStart, EventExtensions.activeListener());
        this._listen('touchmove', this._onTouchMove);
        this._listen('pointerup', this._onPointerUpEvent);
        this._listen(
          'pointercancel',
          this._onPointerUpEvent,
          EventExtensions.activeCaptureListener(),
        );
        this._listen(
          'contextmenu',
          this._preventDuringDrag,
          EventExtensions.activeCaptureListener(),
        );
      });

      this._touchListeners = () => {
        this._unlisten('selectstart', this._onSelectStart, EventExtensions.activeListener());
        this._unlisten('touchmove', this._onTouchMove);
        this._unlisten('pointerup', this._onPointerUpEvent);
        this._unlisten(
          'pointercancel',
          this._onPointerUpEvent,
          EventExtensions.activeCaptureListener(),
        );
        this._unlisten(
          'contextmenu',
          this._preventDuringDrag,
          EventExtensions.activeCaptureListener(),
        );
      };
    }
  };

  /**
   * Handles the select start event.
   * This method is called when the user starts selecting text or elements.
   * It prevents the default behavior and calls the onSelect method to handle the selection.
   * @param event - The event that triggered the select start.
   */
  private _onSelectStart = (event: Event) => {
    this.onSelect(event);
  };

  /**
   * Handles the mouse move event during the drag sequence.
   * It checks if the drag sequence should start and calls the move handler accordingly.
   * @param event - The mouse event that triggered the move.
   */
  private _onMouseMove = (event: MouseEvent) => {
    this._moveHandler(new IMouseEvent(event));
  };

  /**
   * Handles the touch move event during the drag sequence.
   * It checks if the drag sequence should start and calls the move handler accordingly.
   * @param event - The touch event that triggered the move.
   */
  private _onTouchMove = (event: TouchEvent) => {
    this._moveHandler(new ITouchMoveEvent(event));
  };

  /**
   * Checks if the drag sequence should start based on the pointer position.
   * It compares the current pointer position with the initial drag start position
   * and checks if the distance exceeds the drag start threshold.
   * If the threshold is exceeded and the delay has passed,
   * it prepares the drag sequence and sets the move handler to onPointerMove.
   * @param event - The pointer event that triggered the check.
   */
  private _checkDragSequenceToStart(event: IPointerEvent): void {
    const pointerPosition = event.getPosition();

    if (!this.isDragStarted && this._pointerDownElement) {
      event.setTarget(this._pointerDownElement);
      const distanceX = Math.abs(pointerPosition.x - this._dragStartPosition.x);
      const distanceY = Math.abs(pointerPosition.y - this._dragStartPosition.y);
      const isOverThreshold = distanceX + distanceY >= this._dragStartThreshold;

      if (isOverThreshold) {
        const isDelayElapsed = Date.now() >= this._dragStartTime + this._dragStartDelay;

        if (!isDelayElapsed) {
          this._endDragSequence();

          return;
        }

        event.preventDefault();
        this.prepareDragSequence(event);
        this.isDragStarted = true;
        this._moveHandler = this.onPointerMove;
        if (isTouchEvent(event.originalEvent)) {
          this._lastTouchEventTime = Date.now();
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
  private _onPointerUpEvent = (event: PointerEvent) => {
    if (this.isDragStarted) {
      this.onPointerUp(new IPointerUpEvent(event));
    }
    this._endDragSequence();
  };

  /**
   * Ends the drag sequence by resetting the state and removing event listeners.
   * It sets the isDragStarted flag to false, clears the pointerDownElement,
   * and resets the moveHandler to checkDragSequenceToStart.
   * It also removes all mouse and touch event listeners that were added during the drag sequence.
   */
  private _endDragSequence(): void {
    this.isDragStarted = false;
    this._pointerDownElement = null;

    this._moveHandler = this._checkDragSequenceToStart;
    this._mouseListeners();
    this._mouseListeners = EventExtensions.emptyListener();
    this._touchListeners();
    this._touchListeners = EventExtensions.emptyListener();
    this.finalizeDragSequence();
  }

  protected abstract finalizeDragSequence(): void;

  protected abstract onSelect(event: Event): void;

  protected abstract onPointerDown(event: IPointerEvent): boolean;

  protected abstract onPointerMove(event: IPointerEvent): void;

  protected abstract onPointerUp(event: IPointerEvent): void;

  protected subscribe(): void {
    this.unsubscribe();

    this._ngZone?.runOutsideAngular(() => {
      this._listen('mousedown', this._onMouseDown, EventExtensions.activeListener());
      this._listen('touchstart', this._onTouchDown, EventExtensions.passiveListener());
    });

    this._startListeners = () => {
      this._unlisten('mousedown', this._onMouseDown, EventExtensions.activeListener());
      this._unlisten('touchstart', this._onTouchDown, EventExtensions.passiveListener());
    };
  }

  protected unsubscribe(): void {
    this._startListeners();
    this._startListeners = EventExtensions.emptyListener();
    this._touchListeners();
    this._touchListeners = EventExtensions.emptyListener();
    this._mouseListeners();
    this._mouseListeners = EventExtensions.emptyListener();
  }

  private _listen<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this._document.addEventListener(type, listener, options);
  }

  private _unlisten<K extends keyof DocumentEventMap>(
    type: K,
    listener: (this: Document, ev: DocumentEventMap[K]) => unknown,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this._document.removeEventListener(type, listener, options);
  }

  private _preventDuringDrag = (e: Event) => {
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
