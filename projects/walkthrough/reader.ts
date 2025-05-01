import { WalkthroughAnimationHandler } from './animation/walkthrough-animation-handler';
import { WalkthroughTooltipHandler } from './tooltip/walkthrough-tooltip-handler';
import { IWalkthroughStep } from './i-walkthrough-step';
import { WaitForHandler } from './wait-for/wait-for-handler';

export class WalkthroughReader {
  private readonly _cursorRef: HTMLElement;
  private currentStepIndex = 0;

  private _animationHandler: WalkthroughAnimationHandler;
  private _tooltipHandler = new WalkthroughTooltipHandler();
  private _waitForHandler = new WaitForHandler();

  constructor(private steps: IWalkthroughStep[]) {
    this._cursorRef = this.createCursor();
    this._animationHandler = new WalkthroughAnimationHandler(this._cursorRef);
  }

  private createCursor(): HTMLElement {
    const cursor = document.createElement('div');
    cursor.style.position = 'fixed';
    cursor.style.width = '24px';
    cursor.style.height = '24px';
    cursor.style.background = 'url(https://img.icons8.com/?size=512&id=71212&format=png) no-repeat center/contain';
    cursor.style.zIndex = '100000';
    cursor.style.pointerEvents = 'none';
    document.body.appendChild(cursor);
    return cursor;
  }

  public async start(): Promise<void> {
    const steps = this.steps;
    for (let i = 0; i < steps.length; i++) {
      this.currentStepIndex = i;
      await this.executeStep(steps[i]);
    }
    this.dispose();
  }

  private async executeStep(step: IWalkthroughStep): Promise<void> {
    this._tooltipHandler.handle(step.tooltips);

    if (step.animations) {
      for (const action of step.animations) {
        await this._animationHandler.execute(action);
      }
    }

    await this._waitForHandler.handle(step.waitFor);

    this._disposeStep();
  }

  private _disposeStep(): void {
    this._tooltipHandler.dispose();
  }

  public dispose(): void {
    this._cursorRef?.remove();
    this._disposeStep();
  }
}
