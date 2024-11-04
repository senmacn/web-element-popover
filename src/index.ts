import { WPlugin } from './config/global';
import Finder from './modules/finder';
import Monitor from './modules/monitor';
import Scheduler from './modules/scheduler';
import Popover from './plugins/popover';
import { GlobalConfig } from '@/config/config';

const defaultConfig: GlobalConfig = {
  rules: {
    include: [],
    exclude: [],
  },
  keys: [],
};

function setup(target: HTMLElement, globalConfig: GlobalConfig, plugins: WPlugin[]) {
  globalConfig = Object.assign({}, defaultConfig, globalConfig);
  const monitor = new Monitor(target, globalConfig);
  const finder = new Finder({}, globalConfig);
  const scheduler = new Scheduler(monitor, finder, globalConfig);
  plugins.forEach((plugin) => {
    plugin.init(globalConfig);
  });

  return {
    start() {
      scheduler.start();
    },
    end() {
      scheduler.end();
    },
    destroy() {
      monitor.destroy();
      finder.destroy();
      scheduler.destroy();
      plugins.forEach((plugin) => plugin.destroy());
    },
  };
}

export type { GlobalConfig, WPlugin };

export { Popover };

export default setup;
