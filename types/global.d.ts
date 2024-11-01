declare global {
  type NodeChangeType = 'added' | 'removed';

  interface WPlugin {
    init: (config: GlobalConfig) => {};
    destroy: () => {};
  }
}

export {};
