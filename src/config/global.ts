import { GlobalConfig } from './config';

export enum NodeChangeType {
  ADD,
  REMOVE,
  MODIFY,
}

export interface WPlugin {
  init: (config: GlobalConfig) => void;
  destroy: () => void;
}
