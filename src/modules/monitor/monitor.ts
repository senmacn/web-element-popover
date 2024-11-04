import { GlobalConfig } from '@/config/config';
import { NodeChangeType } from '@/config/global';
import { shouldProcessNode } from '@/utils/filter';

class Monitor {
  config = {};
  target: HTMLElement;
  globalConfig: GlobalConfig;
  observer: MutationObserver;
  observing: boolean = false;
  records: Map<HTMLElement, NodeChangeType> = new Map();

  constructor(target: HTMLElement, globalConfig: GlobalConfig) {
    const _this = this;
    this.target = target;
    this.globalConfig = globalConfig;
    this.observer = new MutationObserver(this.callback.bind(_this));
  }

  // 当观察到变动时执行的回调函数
  private callback(mutations: MutationRecord[], _observer: MutationObserver) {
    for (let mutation of mutations) {
      if (mutation.type === 'attributes') continue;

      if (mutation.addedNodes.length > 0) {
        this.processNodes(mutation.addedNodes, NodeChangeType.ADD);
      }

      if (mutation.removedNodes.length > 0) {
        this.processNodes(mutation.removedNodes, NodeChangeType.REMOVE);
      }
    }
  }

  private processNodes = (nodes: NodeList, changeType: NodeChangeType) => {
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i] as HTMLElement;
      if (
        shouldProcessNode(node, this.globalConfig.rules?.include, this.globalConfig.rules?.exclude)
      ) {
        this.records.set(node, changeType);
      }
    }
  };

  start() {
    this.observer.observe(this.target, { childList: true, subtree: true });
    this.observing = true;
  }

  end() {
    this.observer.disconnect();
    this.observing = false;
  }

  transferRecords(): Map<HTMLElement, NodeChangeType> | null {
    if (this.records.size === 0) return null;
    const _records = this.records;
    this.records = new Map();
    return _records;
  }

  destroy() {
    this.end();
    this.target = null as any;
    this.globalConfig = null as any;
    this.observer = null as any;
    this.records.clear();
    this.records = null as any;
  }
}

export default Monitor;
