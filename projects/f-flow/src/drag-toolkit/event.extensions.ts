export class EventExtensions {

  private static isSupported: boolean;

  private static isPassiveEventListenerSupported(): boolean {

    if (EventExtensions.isSupported == null && typeof window !== 'undefined') {
      try {
        window.addEventListener('test', EventExtensions.emptyListener, { passive: true });
        EventExtensions.isSupported = true;
      } catch (e) {
        EventExtensions.isSupported = false;
      }
    }

    return EventExtensions.isSupported;
  }

  private static passiveEventListener(options: AddEventListenerOptions): AddEventListenerOptions | boolean {
    return EventExtensions.isPassiveEventListenerSupported() ? options : !!options.capture;
  }

  public static activeListener(): boolean | AddEventListenerOptions {
    return EventExtensions.passiveEventListener({ passive: false });
  }

  public static passiveListener(): boolean | AddEventListenerOptions {
    return EventExtensions.passiveEventListener({ passive: true });
  }

  public static activeCaptureListener(): boolean | AddEventListenerOptions {
    return EventExtensions.passiveEventListener({ passive: false, capture: true });
  }

  public static emptyListener(): Function {
    return () => {
    };
  }
}
