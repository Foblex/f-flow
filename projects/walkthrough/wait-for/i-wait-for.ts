export interface IWaitFor {
  selector?: string;
  type: 'event' | 'auto';
  event?: 'click' | 'hover' | 'focus' | 'scroll' | 'load';
  delay?: number;
}
