import { fakeAsync, tick } from '@angular/core/testing';
import { transitionEnd } from './transition-end';

describe('transitionEnd', () => {
  it('falls back when the browser does not emit transitionend', fakeAsync(() => {
    const element = document.createElement('div');
    element.style.transition = 'transform 20ms linear';
    document.body.appendChild(element);
    const callback = jasmine.createSpy('callback');

    transitionEnd(element, callback);
    tick(69);
    expect(callback).not.toHaveBeenCalled();

    tick(1);
    expect(callback).toHaveBeenCalledTimes(1);
    element.remove();
  }));

  it('completes only once when transitionend arrives before the fallback', fakeAsync(() => {
    const element = document.createElement('div');
    element.style.transition = 'transform 100ms linear';
    document.body.appendChild(element);
    const callback = jasmine.createSpy('callback');

    transitionEnd(element, callback);
    element.dispatchEvent(new TransitionEvent('transitionend', { propertyName: 'transform' }));
    tick(200);

    expect(callback).toHaveBeenCalledTimes(1);
    element.remove();
  }));
});
