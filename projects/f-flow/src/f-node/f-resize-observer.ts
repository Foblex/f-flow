import { Observable } from 'rxjs';

export class FResizeObserver extends Observable<ResizeObserverEntry[]> {

  constructor(element: HTMLElement) {
    super(subscriber => {
      const observer = new ResizeObserver(entries => {
        subscriber.next(entries);
      });

      observer.observe(element);

      return function unsubscribe() {
        observer.unobserve(element);
        observer.disconnect();
      }
    });
  }
}
