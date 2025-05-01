import { IWalkthroughAnimation } from './i-walkthrough-animation';
import { MoveCursorAnimated } from '../utils/move-cursor-animated';
import { delay } from '../utils/delay';
import { clickCursorAnimation } from '../utils/click-cursor-animation';
import { dragElementAnimated } from '../utils/drag-element-animated';

export class WalkthroughAnimationHandler {

  constructor(
    private _cursorRef: HTMLElement,
  ) {
  }

  public async execute(action: IWalkthroughAnimation) {
    switch (action.type) {
      case 'Translate':
        await this._moveCursor(action);
        break;

      case 'Click':
        await this._click(action);
        break;

      case 'DragAndDrop':
        await this._dragAndDrop(action);
        break;

      default:
        console.warn(`Unknown action type: ${action.type}`);
    }
  }

  private async _moveCursor(action: IWalkthroughAnimation): Promise<void> {
    const source = this._getElement(action.source);
    const target = this._getElement(action.target);
    if (source && target) {
      const motion = new MoveCursorAnimated(this._cursorRef, source, target, { duration: action.duration });
      await motion.move();
      await delay(400);
    }
  }

  private async _click(action: IWalkthroughAnimation): Promise<void> {
    await clickCursorAnimation(this._cursorRef);
    await clickCursorAnimation(this._cursorRef);
    this._getElement(action.target)?.click();
  }

  private async _dragAndDrop(action: IWalkthroughAnimation): Promise<void> {
    const source = this._getElement(action.source);
    const target = this._getElement(action.target);

    if (!source || !target) {
      console.warn('DragAndDrop source or target not found');
      return;
    }

    const sourceRect = source.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const holdTime = action.holdTime || 300;

    const clone = source.cloneNode(true) as HTMLElement;
    clone.style.position = 'fixed';
    clone.style.width = `${sourceRect.width}px`;
    clone.style.height = `${sourceRect.height}px`;
    clone.style.left = `${sourceRect.left}px`;
    clone.style.top = `${sourceRect.top}px`;
    clone.style.zIndex = '100002';
    clone.style.pointerEvents = 'none';
    clone.style.transition = 'transform 0.2s ease';
    clone.style.transform = 'scale(1.05)';
    document.body.appendChild(clone);

    await delay(holdTime);

    await dragElementAnimated(this._cursorRef, clone, sourceRect, targetRect, { duration: action.duration });

    clone.remove();
  }

  private _getElement(selector?: string): HTMLElement | null {
    return selector ? document.querySelector(selector) : null;
  }
}
