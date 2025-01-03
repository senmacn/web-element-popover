import Monitor from '../monitor';
import Finder from '../finder';
import { GlobalConfig } from '@/config/config';
import { NodeChangeType } from '@/config/global';
import { ExecuteNode } from '../finder/finder';

class Scheduler {
  globalConfig: GlobalConfig;
  monitor: Monitor;
  finder: Finder;
  private running: boolean = false;
  private timer: any;
  private maxRetries = 5;
  private retryCount = 0;

  constructor(monitor: Monitor, finder: Finder, globalConfig: GlobalConfig) {
    this.monitor = monitor;
    this.finder = finder;
    this.globalConfig = globalConfig;

    if (globalConfig.leading) {
      this.flush();
    }
  }

  schedule() {
    if (this.timer) clearTimeout(this.timer);

    this.timer = setTimeout(() => {
      this.flush();
    }, this.globalConfig.interval || 500);
  }

  private flush() {
    try {
      if (!this.monitor?.observing) {
        this.checkContinueSchedule();
        return;
      }

      const records = this.monitor.transferRecords();

      if (!records || records.size === 0) {
        this.checkContinueSchedule();
        return;
      }

      this.processRecords(records);
      this.retryCount = 0;
    } catch (error) {
      console.error('Error in schedule:', error);
      this.handleScheduleError();
    } finally {
      this.checkContinueSchedule();
    }
  }

  private processRecords(records: Map<HTMLElement, NodeChangeType>) {
    for (const [element, type] of records.entries()) {
      if (type === NodeChangeType.REMOVE) continue;

      const findResults = this.finder.findInDom(element);
      this.updateNodes(findResults);
    }
  }

  private updateNodes(findResults: Map<ExecuteNode, string[]>) {
    findResults.forEach((keys, node) => {
      if (!this.globalConfig.executeFunc) return;

      if (node instanceof Text) {
        const newTextContent = keys.reduce((html, key) => {
          const replacement = this.globalConfig.executeFunc!(key);
          return html.replaceAll(key, replacement);
        }, node.textContent || '');
        debugger;
        node.parentElement?.insertAdjacentHTML('afterbegin', newTextContent);
        node.parentElement?.removeChild(node);
      } else {
        const newInnerHTML = keys.reduce((html, key) => {
          const replacement = this.globalConfig.executeFunc!(key);
          return html.replaceAll(key, replacement);
        }, node.innerHTML);

        node.innerHTML = newInnerHTML;
      }
    });
  }

  private handleScheduleError() {
    this.retryCount++;
    if (this.retryCount < this.maxRetries) {
      console.warn(`Retrying schedule... Attempt ${this.retryCount} of ${this.maxRetries}`);
      this.checkContinueSchedule();
    } else {
      console.error(`Max retries (${this.maxRetries}) reached. Stopping scheduler.`);
      this.end();
    }
  }

  private checkContinueSchedule() {
    if (this.running) {
      this.schedule();
    }
  }

  start() {
    if (!this.running) {
      this.running = true;
      this.monitor.start();
      this.schedule();
    }
  }
  end() {
    this.running = false;
    this.monitor.end();
    if (this.timer) {
      clearTimeout(this.timer);
    }
    this.retryCount = 0;
  }

  destroy() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.retryCount = 0;
    this.running = false;
    this.monitor.end();
    this.monitor.destroy();
  }
}

export default Scheduler;
