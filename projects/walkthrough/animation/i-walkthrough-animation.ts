export interface IWalkthroughAnimation {
  type: 'Translate' | 'Click' | 'DragAndDrop';
  source?: string;
  target?: string;
  duration?: number;
  holdTime?: number;
}
