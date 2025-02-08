import { fromEvent, Subscription, switchMap } from 'rxjs';
import { copyToClipboard } from './clipboard';
import { ICodeGroupView } from './f-code-group';
import { IParsedContainer } from '../i-parsed-container';
import { Injector } from '@angular/core';
import { HighlightService } from '../../highlight';
import { take } from 'rxjs/operators';
import { DOCUMENT } from '@angular/common';
import { FPopoverService } from '../../../../../../common-services';

export class FCodeViewHandler implements ICodeGroupView, IParsedContainer {

  protected subscriptions$: Subscription = new Subscription();

  protected fDocument: Document;

  constructor(
    public element: HTMLElement,
    public injector: Injector
  ) {
    this.fDocument = this.injector.get(DOCUMENT);
    this.initialize();
  }

  protected initialize(): void {
    if (this.isServer()) return;
    this.createCopyButton();
    this.createLanguageBadge();
    this.injector.get(HighlightService).highlight(this.element).pipe(take(1)).subscribe(() => {
      this.subscriptions$.add(this.subscribeOnCopyButtonClick());
    });
  }

  protected isServer(): boolean {
    return typeof window === 'undefined';
  }

  private createCopyButton(): HTMLButtonElement {
    const button = this.fDocument.createElement('button');
    button.classList.add('f-copy-button');
    this.element.appendChild(button);
    return button;
  }

  private createLanguageBadge(): void {
    const badge = this.fDocument.createElement('span');
    badge.classList.add('f-code-language');
    badge.textContent = this.getLanguage();
    this.element.appendChild(badge);
  }

  private getLanguage(): string {
    return this.getCodeBlock().classList[0].replace('language-', '');
  }

  private getCopyButton(): HTMLButtonElement {
    return this.element.querySelector('.f-copy-button') as HTMLButtonElement;
  }

  protected getCodeBlock(): HTMLElement {
    return this.element.querySelector('code') as HTMLElement;
  }

  public setDisplay(value: string): void {
    this.element.style.display = value;
  }

  private subscribeOnCopyButtonClick(): Subscription {
    return fromEvent(this.getCopyButton(), 'click').pipe(
      switchMap(() => copyToClipboard(this.getCodeBlock().textContent!))
    ).subscribe(() => {
      this.injector.get(FPopoverService).show('Copied!');
    });
  }

  public dispose(): void {
    this.subscriptions$.unsubscribe();
  }
}
