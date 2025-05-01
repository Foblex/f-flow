import { IAnchorPosition } from '../anchor/i-anchor-position';

export interface IWalkthroughTooltip {
  content: string;
  origin: {
    selector: string;
    position: IAnchorPosition;
  };
  style?: Partial<CSSStyleDeclaration>;
}
