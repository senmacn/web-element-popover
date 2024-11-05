import { WPlugin } from './config/global';
import Finder from './modules/finder';
import Monitor from './modules/monitor';
import Scheduler from './modules/scheduler';
import Popover from './plugins/popover';
import { defaultConfig, GlobalConfig } from '@/config/config';
import deepMerge from './utils/deepMerge';

function setup(target: HTMLElement, globalConfig: GlobalConfig, plugins: WPlugin[]) {
  if (!target || !(target instanceof HTMLElement)) {
    throw new Error('Invalid target element');
  }

  const mergedConfig: GlobalConfig = deepMerge(defaultConfig, globalConfig);

  let monitor: Monitor | null = null;
  let finder: Finder | null = null;
  let scheduler: Scheduler | null = null;

  try {
    plugins.forEach((plugin) => {
      if (typeof plugin.init === 'function') {
        plugin.init(mergedConfig);
      }
    });

    monitor = new Monitor(target, mergedConfig);
    finder = new Finder({}, mergedConfig);
    scheduler = new Scheduler(monitor, finder, mergedConfig);

    return {
      start() {
        scheduler?.start();
      },
      end() {
        scheduler?.end();
      },
      destroy() {
        monitor?.destroy();
        finder?.destroy();
        scheduler?.destroy();
        plugins.forEach((plugin) => {
          if (typeof plugin.destroy === 'function') {
            plugin.destroy();
          }
        });
        monitor = finder = scheduler = null;
      },
    };
  } catch (error) {
    console.error('Error during setup:', error);
    throw error;
  }
}

export type { GlobalConfig, WPlugin };

export { Popover };

export default setup;
