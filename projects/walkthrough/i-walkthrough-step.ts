import { IWalkthroughTooltip } from './tooltip/i-walkthrough-tooltip';
import { IWalkthroughAnimation } from './animation/i-walkthrough-animation';
import { IWaitFor } from './wait-for/i-wait-for';

export interface IWalkthroughStep {
  tooltips?: IWalkthroughTooltip[];
  animations?: IWalkthroughAnimation[];
  waitFor?: IWaitFor;
}
