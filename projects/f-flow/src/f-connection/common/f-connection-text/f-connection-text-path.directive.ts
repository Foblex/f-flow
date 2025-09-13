import { Directive, ElementRef, inject, OnInit } from '@angular/core';
import { F_CONNECTION_IDENTIFIERS } from '../f-connection-identifiers';
import { F_CONNECTION } from '../f-connection.injection-token';
import { IHasConnectionText } from '../i-has-connection-text';
import { IHasConnectionFromTo } from '../i-has-connection-from-to';
import { BrowserService } from '@foblex/platform';
import { IHasHostElement } from '../../../i-has-host-element';

@Directive({
  selector: 'textPath[f-connection-text-path]',
  host: {
    '[attr.href]': 'linkToConnection',
  },
})
export class FConnectionTextPathDirective implements IHasHostElement, OnInit {
  public readonly hostElement = inject(ElementRef<SVGTextPathElement>).nativeElement;
  private readonly _base = inject(F_CONNECTION) as IHasConnectionText & IHasConnectionFromTo;
  private readonly _browser = inject(BrowserService);

  public get linkToConnection(): string {
    return F_CONNECTION_IDENTIFIERS.linkToConnection(
      this._base.fId() + this._base.fOutputId() + this._base.fInputId(),
    );
  }

  public symbolWidth: number = 8;
  public fontSize: string = '12px';

  public ngOnInit(): void {
    this.hostElement.setAttribute('text-anchor', `middle`);
    this.symbolWidth = this._getSymbolWidth(this._base.fText || '');
  }

  public getBBox(): DOMRect {
    return this.hostElement.getBBox();
  }

  public redraw(): void {
    this.hostElement.setAttribute('startOffset', this._base.fTextStartOffset || '50%');
  }

  private _getFontStyles(element: SVGTextPathElement): { fontSize: string; fontFamily: string } {
    const computedStyles = this._browser.window.getComputedStyle(element);

    return {
      fontSize: computedStyles.fontSize,
      fontFamily: computedStyles.fontFamily,
    };
  }

  private _getSymbolWidth(name: string): number {
    const text = name || 'connection';
    const { fontFamily, fontSize } = this._getFontStyles(this.hostElement);
    this.fontSize = fontSize || '12px';
    const canvas = this._browser.document.createElement('canvas');
    let context;

    try {
      context = canvas.getContext('2d');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      context = null;
    }
    if (!context) {
      return 0;
    }

    context.font = `${fontSize} ${fontFamily}`;

    const metrics = context.measureText(text);
    const symbolWidth = metrics.width / text.length;

    return symbolWidth;
  }
}
