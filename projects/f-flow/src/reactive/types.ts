export type FChannelListener = () => void;

export type FChannelOperator = (callback: FChannelListener) => FChannelListener;
