import Finder from './modules/finder';
import Monitor from './modules/monitor';
import Scheduler from './modules/scheduler';
import Popover from './plugins/popover';

function setup(target: HTMLElement, globalConfig: GlobalConfig, plugins: WPlugin[]) {
  const monitor = new Monitor(target, globalConfig);
  const finder = new Finder({}, globalConfig);
  const scheduler = new Scheduler(monitor, finder, globalConfig);
  plugins.forEach((plugin) => {
    plugin.init(globalConfig);
  });

  return {
    destroy() {
      monitor.destroy();
      finder.destroy();
      scheduler.destroy();
      plugins.forEach((plugin) => plugin.destroy());
    },
  };
}

export type { GlobalConfig };

export { Popover };

export default setup;
