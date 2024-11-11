import { GlobalConfig } from '@/config/config';
import { WPlugin } from '@/config/global';
import {
  PopoverKey,
  PopoverBoxKey,
  PopoverKeyData,
  ContentType,
  PopoverProps,
  excludeItems,
} from './constants';
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
  let currentTarget: HTMLElement | null = null;
  let delayShowTimer: NodeJS.Timeout | null = null;
  let delayHideTimer: NodeJS.Timeout | null = null;

  const delayShow =
    (options?.delay && (Array.isArray(options.delay) ? options.delay[0] : options.delay)) || 0;
  const delayHide =
    (options?.delay && (Array.isArray(options.delay) ? options.delay[1] : options.delay)) || 0;

  const handlePopoverEvent = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains(PopoverKey)) return;

    clearTimeout(delayHideTimer as NodeJS.Timeout);
    delayHideTimer = null;

    if (currentTarget !== target || !currentInstance) {
      currentInstance?.destroy();
      const keyData = target.getAttribute(PopoverKeyData) || '';
      currentInstance = createPopover(target, keyData, content, { ...options });
      currentTarget = target;
    }
    if (!delayShowTimer) {
      delayShowTimer = setTimeout(() => {
        currentInstance?.show();
        delayShowTimer = null;
      }, delayShow);
    }
  };

  const handleMouseLeave = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!target.classList.contains(PopoverBoxKey) && !target.classList.contains(PopoverKey)) return;

    clearTimeout(delayShowTimer as NodeJS.Timeout);
    delayShowTimer = null;

    delayHideTimer = setTimeout(() => {
      currentInstance?.hideWithInteractivity({} as any);
      delayHideTimer = null;
    }, delayHide);
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
