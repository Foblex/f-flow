import { Directive, ElementRef, Inject, OnInit } from '@angular/core';
import { IHasHostElement } from '@foblex/core';
import { F_CONNECTION_IDENTIFIERS } from '../f-connection-identifiers';
import { F_CONNECTION } from '../f-connection.injection-token';
import { IHasConnectionText } from '../i-has-connection-text';
import { IHasConnectionFromTo } from '../i-has-connection-from-to';
import { BrowserService } from '@foblex/platform';
import { createHTMLElement } from '../../../domain';

@Directive({
  selector: 'textPath[f-connection-text-path]',
  host: {
    '[attr.href]': 'linkToConnection'
  }
})
export class FConnectionTextPathDirective implements IHasHostElement, OnInit {

  public get linkToConnection(): string {
    return F_CONNECTION_IDENTIFIERS.linkToConnection(
      this.base.fId + this.base.fOutputId + this.base.fInputId
    );
  }

  public get hostElement(): SVGTextPathElement {
    return this.elementReference.nativeElement;
  }

  public symbolWidth: number = 8;
  public fontSize: string = '12px';

  constructor(
      private elementReference: ElementRef<SVGTextPathElement>,
      @Inject(F_CONNECTION) private base: IHasConnectionText & IHasConnectionFromTo,
      private fBrowser: BrowserService
  ) {
  }

  public ngOnInit(): void {
    this.hostElement.setAttribute('startOffset', '50%');
    this.hostElement.setAttribute('text-anchor', `middle`);
    this.symbolWidth = this.getSymbolWidth(this.base.fText || '');
  }

  public getBBox(): DOMRect {
    return this.hostElement.getBBox();
  }

  private getFontStyles(element: SVGTextPathElement): { fontSize: string, fontFamily: string } {
    const computedStyles = this.fBrowser.window.getComputedStyle(element);
    return {
      fontSize: computedStyles.fontSize,
      fontFamily: computedStyles.fontFamily
    };
  }

  private getSymbolWidth(name: string): number {
    const text = name || 'connection';
    const { fontFamily, fontSize } = this.getFontStyles(this.hostElement);
    this.fontSize = fontSize;
    const canvas = createHTMLElement('canvas', this.fBrowser);
    let context;

    try {
      context = canvas.getContext('2d');
    } catch (e) {
      context = null;
    }
    if (!context) {
      return 0;
    }

    context.font = `${ fontSize } ${ fontFamily }`;

    const metrics = context.measureText(text);
    const symbolWidth = metrics.width / text.length;
    return symbolWidth;
  }
}
