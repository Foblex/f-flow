export type FChannelListener = () => void;

export type FChannelOperator = (callback: FChannelListener) => {
  callback: FChannelListener;
  cleanup?: () => void;
  onSubscribe?: (finalCallback: FChannelListener) => void;
  setTeardown?: (teardown: () => void) => void;
};
