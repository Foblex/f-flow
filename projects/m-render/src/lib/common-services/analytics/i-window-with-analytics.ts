import { IWindowService } from '@foblex/platform';

export interface IWindowWithAnalytics extends IWindowService {

  dataLayer?: any[];

  gtag?(...args: any[]): void;
}
