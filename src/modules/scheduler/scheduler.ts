import Monitor from '../monitor';
import Finder from '../finder';

class Scheduler {
  globalConfig: GlobalConfig;
  monitor: Monitor;
  finder: Finder;
  running: boolean = false;
  timer: any;

  constructor(monitor: Monitor, finder: Finder, globalConfig: GlobalConfig) {
    this.monitor = monitor;
    this.finder = finder;
    this.globalConfig = globalConfig;
  }

  schedule() {
    this.timer = setTimeout(() => {
      if (!this.monitor?.observing) {
        this.continueSchedule();
        return;
      }

      const records = this.monitor.getRecords();
      if (!records) {
        this.continueSchedule();
        return;
      }

      this.processRecords(records);
      this.continueSchedule();
    }, 500);
  }

  private processRecords(records: Map<HTMLElement, string>) {
    for (const [element, type] of records.entries()) {
      if (type !== 'added') continue;

      const findResults = this.finder.findInDom(element);
      this.updateNodes(findResults);
    }
  }

  private updateNodes(findResults: Map<HTMLElement, string[]>) {
    findResults.forEach((keys, node) => {
      if (!this.globalConfig.executeFunc) return;

      const newInnerHTML = keys.reduce((html, key) => {
        const replacement = this.globalConfig.executeFunc!(key);
        return html.replaceAll(key, replacement);
      }, node.innerHTML);

      node.innerHTML = newInnerHTML;
    });
  }

  private continueSchedule() {
    if (this.running) {
      this.schedule();
    }
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.schedule();
    }
  }
  end() {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }

  destroy() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.running = false;
    this.monitor.end();
    this.monitor.destroy();
  }
}

export default Scheduler;
