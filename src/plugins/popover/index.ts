import { GlobalConfig } from '@/config/config';
import { WPlugin } from '@/config/global';
import {
  PopoverKey,
  PopoverBoxKey,
  PopoverKeyData,
  PopoverKeyClickEmitterClass,
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
  keyRender,
  options,
}: {
  trigger: 'click' | 'hover';
  content: ContentType;
  bindClasses?: string | string[];
  keyRender?: (key: string) => boolean;
  options?: PopoverProps;
}): WPlugin {
  const defaultTrigger = getTriggerEvent(trigger);

  let currentInstance: Instance | null = null;
  let currentTarget: HTMLElement | null = null;
  let delayShowTimer: NodeJS.Timeout | null = null;
  let delayHideTimer: NodeJS.Timeout | null = null;

  const delayShow =
    (options?.delay && (Array.isArray(options.delay) ? options.delay[0] : options.delay)) || 0;
  const delayHide =
    (options?.delay && (Array.isArray(options.delay) ? options.delay[1] : options.delay)) || 0;

  const handlePopoverEvent = (event: MouseEvent) => {
    if (defaultTrigger !== 'mouseover') return;
    const target = event.target as HTMLElement;
    if (!(target instanceof HTMLElement)) return;
    if (!target.classList.contains(PopoverKey)) return;

    if (currentTarget !== target || !currentInstance) {
      currentInstance?.destroy();
      const keyData = target.getAttribute(PopoverKeyData) || '';
      currentInstance = createPopover(target, keyData, content, { ...options });
      currentTarget = target;
    }
    if (!delayShowTimer) {
      if (target.className.includes(PopoverKeyClickEmitterClass)) {
        currentInstance?.show();
      } else {
        clearTimeout(delayHideTimer as NodeJS.Timeout);
        delayHideTimer = null;

        if (getComputedStyle(target).textDecorationLine === 'none') return;
        delayShowTimer = setTimeout(() => {
          currentInstance?.show();
          delayShowTimer = null;
        }, delayShow);
      }
    }
  };

  const handleClickEvent = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!(target instanceof HTMLElement)) return;
    if (defaultTrigger !== 'click') return;

    clearTimeout(delayHideTimer as NodeJS.Timeout);
    delayHideTimer = null;

    clearTimeout(delayShowTimer as NodeJS.Timeout);
    delayShowTimer = null;

    event.stopPropagation();
    event.preventDefault();

    if (currentTarget !== target || !currentInstance) {
      currentInstance?.destroy();
      const keyData = target.getAttribute(PopoverKeyData) || '';
      currentInstance = createPopover(target, keyData, content, { ...options });
      currentTarget = target;
      currentInstance?.show();
    } else {
      currentInstance?.show();
    }
  };

  const handleMouseLeave = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (!(target instanceof HTMLElement)) return;
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
        return `<span class="${PopoverKey} ${_bindClasses}" ${PopoverKeyData}="${key}">
        ${
          keyRender && keyRender(key)
            ? `${key}
          <span class="${PopoverKey} ${PopoverKeyClickEmitterClass}" ${PopoverKeyData}="${key}">
          ?
          </span>`
            : key
        }
          </span>`;
      };

      globalConfig.rules = {
        ...globalConfig.rules,
        exclude: [...(globalConfig.rules?.exclude || []), ...excludeItems],
      };

      defaultTrigger === 'click' && document.body.addEventListener('click', handleClickEvent, true);
      defaultTrigger === 'mouseover' &&
        document.body.addEventListener('mouseover', handlePopoverEvent, true);
      document.body.addEventListener('mouseleave', handleMouseLeave, true);
    },
    destroy() {
      defaultTrigger === 'click' && document.body.addEventListener('click', handleClickEvent, true);
      defaultTrigger === 'mouseover' &&
        document.body.removeEventListener('mouseover', handlePopoverEvent, true);
      document.body.removeEventListener('mouseleave', handleMouseLeave, true);
    },
  };
}

export default Popover;
