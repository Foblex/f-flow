import { IWaitFor } from './i-wait-for';
import { delay } from '../utils/delay';

export class WaitForHandler {

  public handle(value?: IWaitFor): Promise<void> {
    if (!value) {
      return Promise.resolve();
    }
    switch (value.type) {
      case 'event':
        return this._handleEvent(value);
      case 'auto':
        return delay(value.delay || 1000);
      default:
        throw new Error(`Unknown wait-for type: ${ value.type }`);
    }
  }


  private _handleEvent(value: IWaitFor): Promise<void> {
    const origin = this._getElement(value.selector);
    return new Promise((resolve) => {
      origin.addEventListener(value.event!, () => resolve(), { once: true });
    });
  }

  private _getElement(selector?: string): HTMLElement {
    if (!selector) {
      throw new Error('No selector provided for wait-for');
    }
    const element = document.querySelector<HTMLElement>(selector);
    if (!element) {
      throw new Error(`Element not found for selector: ${ selector }`);
    }
    return element;
  }
}
