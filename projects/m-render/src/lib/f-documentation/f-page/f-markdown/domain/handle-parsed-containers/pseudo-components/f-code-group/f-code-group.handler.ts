import { Injector } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { FCodeGroupBodyHandler } from '../f-code-group-body.handler';
import { IParsedContainer } from '../../i-parsed-container';

export class FCodeGroupHandler implements IParsedContainer {

  private subscriptions$: Subscription = new Subscription();

  private body: FCodeGroupBodyHandler;

  private get tabs(): HTMLButtonElement[] {
    return Array.from(this.element.querySelectorAll('.f-tab-button'));
  }

  private get firstTab(): HTMLButtonElement | undefined {
    const tabs = this.tabs;
    if (!tabs.length) {
      return undefined;
    }
    return tabs[ 0 ];
  }

  constructor(
    private element: HTMLElement,
    private injector: Injector,
  ) {
    this.body = new FCodeGroupBodyHandler(this.element, this.injector);
    this.initialize();
  }

  private initialize(): void {
    this.subscribeOnTabsClick();
    this.onTabClick(this.firstTab);
  }

  private subscribeOnTabsClick(): void {
    this.tabs.forEach((tab) => {
      this.subscriptions$.add(this.subscribeOnTabClick(tab));
    });
  }

  private subscribeOnTabClick(tab: HTMLButtonElement): Subscription {
    return fromEvent(tab, 'click').subscribe(() => this.onTabClick(tab));
  }

  private onTabClick(targetTab: HTMLButtonElement | undefined): void {
    if (targetTab) {
      this.markActiveTab(targetTab);
      this.body.toggle(this.getTargetTabIndex(targetTab));
    }
  }

  private markActiveTab(target: HTMLButtonElement): void {
    this.tabs.forEach(tab => tab.classList.remove('active'));
    target.classList.add('active');
  }

  private getTargetTabIndex(target: HTMLButtonElement): number {
    return this.tabs.indexOf(target);
  }

  public dispose(): void {
    this.body.dispose();
    this.subscriptions$.unsubscribe();
  }
}
