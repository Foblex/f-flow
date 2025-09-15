import { ChangeDetectionStrategy, Component, ElementRef, inject, viewChild } from '@angular/core';
import { ILine, PointExtensions } from '@foblex/2d';
import { FConnectionTextPathDirective } from './f-connection-text-path.directive';
import { F_CONNECTION_IDENTIFIERS } from '../f-connection-identifiers';
import { IHasConnectionText } from '../i-has-connection-text';
import { IHasConnectionFromTo } from '../i-has-connection-from-to';
import { F_CONNECTION } from '../f-connection.injection-token';
import { CONNECTION_TEXT, IConnectionText } from './i-connection-text';

@Component({
  selector: 'text[f-connection-text]',
  templateUrl: './f-connection-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'f-component f-connection-text',
    '[attr.id]': 'textId',
  },
  providers: [{ provide: CONNECTION_TEXT, useExisting: FConnectionTextComponent }],
})
export class FConnectionTextComponent implements IConnectionText {
  public readonly hostElement = inject(ElementRef<SVGTextElement>).nativeElement;
  private readonly _base = inject(F_CONNECTION) as IHasConnectionText & IHasConnectionFromTo;

  private readonly _textPathDirective = viewChild.required(FConnectionTextPathDirective);

  public get textId(): string {
    return F_CONNECTION_IDENTIFIERS.textId(
      this._base.fId() + this._base.fOutputId() + this._base.fInputId(),
    );
  }

  public get text(): string {
    return this._base.fText || '';
  }

  public redraw(line: ILine): void {
    this._textPathDirective().redraw();
    const isTextReverse: boolean = FConnectionTextComponent._isTextReverse(line);
    const dyValue = this._calculateDy(this._textPathDirective().fontSize, isTextReverse);

    this.hostElement.setAttribute('dy', dyValue);

    const textRect = this._textPathDirective().getBBox();
    const textRectCenter = [textRect.x + textRect.width / 2, textRect.y + textRect.height / 2];
    this.hostElement.setAttribute(
      'transform',
      isTextReverse ? `rotate(180, ${textRectCenter})` : '',
    );
    const startOffset = FConnectionTextComponent._getTextStartOffset(
      line,
      this._base.fText || '',
      this._textPathDirective().symbolWidth,
    );
    if (startOffset < 0) {
      this.hostElement.style.display = 'none';
    } else {
      this.hostElement.style.display = 'unset';
    }
  }

  private _calculateDy(fontSize: string, isTextReverse: boolean): string {
    const fontSizeNumber = parseFloat(fontSize);

    const dyValue = isTextReverse ? fontSizeNumber * 1.5 : fontSizeNumber * -0.8;

    return dyValue.toString();
  }

  private static _isTextReverse(line: ILine): boolean {
    return line.point1.x > line.point2.x;
  }

  private static _getTextStartOffset(line: ILine, name: string, symbolWidth: number): number {
    const vectorLength: number = PointExtensions.hypotenuse(line.point1, line.point2);

    return vectorLength / 2 - ((name || '').length * symbolWidth) / 2;
  }
}
