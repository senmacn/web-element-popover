import { GlobalConfig } from "./config";

export type NodeChangeType = 'added' | 'removed';

export interface WPlugin {
  init: (config: GlobalConfig) => void;
  destroy: () => void;
}
