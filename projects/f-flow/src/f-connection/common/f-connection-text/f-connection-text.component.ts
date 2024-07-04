import {
  ChangeDetectionStrategy,
  Component, ElementRef, Inject, ViewChild
} from "@angular/core";
import { IVector, PointExtensions } from '@foblex/core';
import { FConnectionTextPathDirective } from './f-connection-text-path.directive';
import { F_CONNECTION_IDENTIFIERS } from '../f-connection-identifiers';
import { IHasConnectionText } from '../i-has-connection-text';
import { IHasConnectionFromTo } from '../i-has-connection-from-to';
import { F_CONNECTION } from '../f-connection.injection-token';
import { CONNECTION_TEXT, IConnectionText } from './i-connection-text';

@Component({
  selector: "text[f-connection-text]",
  templateUrl: "./f-connection-text.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: "f-component f-connection-text",
    '[attr.id]': 'textId',
  },
  providers: [ { provide: CONNECTION_TEXT, useExisting: FConnectionTextComponent } ],
})
export class FConnectionTextComponent implements IConnectionText {

  public get textId(): string {
    return F_CONNECTION_IDENTIFIERS.textId(
      this.base.fConnectionId + this.base.fOutputId + this.base.fInputId
    );
  }

  public get hostElement(): SVGTextElement {
    return this.elementReference.nativeElement;
  }

  public get text(): string {
    return this.base.fText || '';
  }

  @ViewChild(FConnectionTextPathDirective, { static: true })
  public textPathDirective!: FConnectionTextPathDirective;

  constructor(
      private elementReference: ElementRef<SVGTextElement>,
      @Inject(F_CONNECTION) private base: IHasConnectionText & IHasConnectionFromTo,
  ) {
  }

  public redraw(vector: IVector): void {

    const isTextReverse: boolean = FConnectionTextComponent.isTextReverse(vector);
    const dyValue = this.calculateDy(this.textPathDirective.fontSize, isTextReverse);

    this.hostElement.setAttribute('dy', dyValue);

    const textRect = this.textPathDirective.getBBox();
    const textRectCenter = [ textRect.x + textRect.width / 2, textRect.y + textRect.height / 2 ];
    this.hostElement.setAttribute('transform', isTextReverse ? `rotate(180, ${ textRectCenter })` : '');
    const startOffset = FConnectionTextComponent.getTextStartOffset(vector, this.base.fText || '', this.textPathDirective.symbolWidth);
    if (startOffset < 0) {

      this.hostElement.style.display = 'none';
    } else {

      this.hostElement.style.display = 'unset';
    }
  }

  private calculateDy(fontSize: string, isTextReverse: boolean): string {
    const fontSizeNumber = parseFloat(fontSize);

    const dyValue = isTextReverse ? fontSizeNumber * 1.5 : fontSizeNumber * -0.8;

    return dyValue.toString();
  }

  private static isTextReverse(vector: IVector): boolean {
    return vector.point1.x > vector.point2.x;
  }

  private static getTextStartOffset(vector: IVector, name: string, symbolWidth: number): number {
    const vectorLength: number = PointExtensions.hypotenuse(vector.point1, vector.point2);
    return vectorLength / 2 - ((name || '').length * symbolWidth) / 2;
  }
}

