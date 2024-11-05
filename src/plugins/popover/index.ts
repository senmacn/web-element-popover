import { GlobalConfig } from '@/config/config';
import { WPlugin } from '@/config/global';
import { PopoverKey, PopoverBoxKey, PopoverKeyData, ContentType, PopoverProps, excludeItems } from './constants';
import { createPopover, getTriggerEvent } from './utils';
import { Instance } from 'tippy.js';

function Popover({
  trigger = 'click',
  content,
  bindClasses,
  options,
}: {
  trigger: 'click' | 'hover';
  content: ContentType;
  bindClasses?: string | string[];
  options?: PopoverProps;
}): WPlugin {
  let currentInstance: Instance | null = null;

  const handlePopoverEvent = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains(PopoverKey)) {
      if (currentInstance && currentInstance.destroy) {
        currentInstance?.destroy();
      }
      const keyData = target.getAttribute(PopoverKeyData) || '';
      currentInstance = createPopover(target, keyData, content, options && { ...options });
      currentInstance?.show();
    }
  };

  const handleMouseLeave = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains(PopoverBoxKey) || target.classList.contains(PopoverKey)) {
      currentInstance && currentInstance?.hideWithInteractivity({} as any);
    }
  };

  return {
    init(globalConfig: GlobalConfig) {
      globalConfig.executeFunc = (key: string) => {
        const _bindClasses = Array.isArray(bindClasses) ? bindClasses.join(' ') : bindClasses || '';
        return `<span class="${PopoverKey} ${_bindClasses}" ${PopoverKeyData}="${key}">${key}</span>`;
      };

      globalConfig.rules = {
        ...globalConfig.rules,
        exclude: [...(globalConfig.rules?.exclude || []), ...excludeItems],
      };

      document.body.addEventListener(getTriggerEvent(trigger), handlePopoverEvent);
      document.body.addEventListener('mouseleave', handleMouseLeave, true);
    },
    destroy() {
      document.body.removeEventListener(getTriggerEvent(trigger), handlePopoverEvent);
      document.body.removeEventListener('mouseleave', handleMouseLeave, true);
    },
  };
}

export default Popover;