import { GlobalConfig } from './config';

export enum NodeChangeType {
  ADD = 'added',
  REMOVE = 'removed',
}

export interface WPlugin {
  init: (config: GlobalConfig) => void;
  destroy: () => void;
}
