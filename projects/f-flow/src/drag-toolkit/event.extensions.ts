export class EventExtensions {
  private static _isSupported: boolean;

  private static _isPassiveEventListenerSupported(): boolean {
    if (EventExtensions._isSupported == null && typeof window !== 'undefined') {
      try {
        window.addEventListener('test', EventExtensions.emptyListener, { passive: true });
        EventExtensions._isSupported = true;
      } catch {
        EventExtensions._isSupported = false;
      }
    }

    return EventExtensions._isSupported;
  }

  private static _passiveEventListener(
    options: AddEventListenerOptions,
  ): AddEventListenerOptions | boolean {
    return EventExtensions._isPassiveEventListenerSupported() ? options : !!options.capture;
  }

  public static activeListener(): boolean | AddEventListenerOptions {
    return EventExtensions._passiveEventListener({ passive: false });
  }

  public static passiveListener(): boolean | AddEventListenerOptions {
    return EventExtensions._passiveEventListener({ passive: true });
  }

  public static activeCaptureListener(): boolean | AddEventListenerOptions {
    return EventExtensions._passiveEventListener({ passive: false, capture: true });
  }

  public static emptyListener(): () => void {
    return () => {};
  }
}
