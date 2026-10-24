import { ISize } from './i-size';

export class SizeExtensions {
  public static initialize(width: number = 0, height: number = 0): ISize {
    return { width, height };
  }

  public static isEqual(size1: ISize, size2: ISize): boolean {
    return size1.width === size2.width && size1.height === size2.height;
  }

  public static offsetFromElement(element: HTMLElement | SVGElement): ISize | undefined {
    if (element instanceof SVGGraphicsElement) {
      const bBox = element.getBBox();

      return SizeExtensions.initialize(bBox.width, bBox.height);
    } else if (element instanceof HTMLElement) {
      return SizeExtensions.initialize(element.offsetWidth, element.offsetHeight);
    }

    return undefined;
  }
}
