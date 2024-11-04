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
      else {
        const rules = this.globalConfig.rules;
        if (mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (shouldProcessNode(node as HTMLElement, rules?.include, rules?.exclude)) {
              this.records.set(node as HTMLElement, 'added');
            }
          });
        }
        if (mutation.removedNodes.length > 0) {
          mutation.removedNodes.forEach((node) => {
            if (shouldProcessNode(node as HTMLElement, rules?.include, rules?.exclude)) {
              this.records.set(node as HTMLElement, 'removed');
            }
          });
        }
      }
    }
  }

  start() {
    this.observer.observe(this.target, { childList: true, subtree: true });
    this.observing = true;
  }

  end() {
    this.observer.disconnect();
    this.observing = false;
  }

  getRecords(): Map<HTMLElement, NodeChangeType> {
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
