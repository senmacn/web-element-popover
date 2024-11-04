import { GlobalConfig } from '@/config/config';
import { WPlugin } from '@/config/global';
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const PopoverKey = 'tippy-tippy';
const PopoverKeyData = 'tippy-data';

type ContentType = string | ((keyData: string) => Promise<string>);

function createPopover(
  element: HTMLElement,
  keyData: string,
  content: ContentType,
  options?: {
    defaultContent?: string;
    trigger?: string;
  }
) {
  let instance;
  const _options = Object.assign(
    {
      trigger: options?.trigger || 'hover',
      allowHTML: true,
      arrow: true,
      delay: [100, 100] as [number, number],
    },
    options
  );
  if (typeof content === 'string') {
    instance = tippy(element, {
      content,
      ..._options,
    });
  }
  if (typeof content === 'function') {
    instance = tippy(element, {
      content: options?.defaultContent || '',
      onShow(instance: any) {
        content(keyData)
          .then((str) => {
            instance.setContent(str);
          })
          .catch((error) => {
            console.error(`Failed to get async content: ${error}`);
            instance.setContent(options?.defaultContent || '');
          });
      },
      ..._options,
    });
  }
  return instance;
}

function getTriggerEvent(trigger: string) {
  if (trigger === 'click') return 'click';
  if (trigger === 'hover') return 'mouseover';
  console.error(`Invalid trigger: ${trigger}. Defaulting to 'click' as a fallback.`);
  return 'click';
}

const excludeItems = [
  { tag: 'span', class: PopoverKey },
  { func: (ele: any) => !!ele._tippy || ele.id.includes('tippy-') },
];

/**
 * Content Example:
 *  <div data-tippy-root>
 *    <div class="tippy-box" data-placement="top">
 *      <div class="tippy-content">
 *        My content
 *      </div>
 *    </div>
 *  </div>
 *
 * indClasses Example:
 *  <span class=${PopoverKey + ' ' + _bindClasses} ${PopoverKeyData}=${key}>${key}</span>
 */
function Popover({
  trigger = 'click',
  content,
  bindClasses,
}: {
  trigger: 'click' | 'hover';
  content: ContentType;
  bindClasses?: string | string[];
}): WPlugin {
  let currentInstance: any = null;

  const handlePopoverEvent = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains(PopoverKey)) {
      const keyData = target.getAttribute(PopoverKeyData) || '';
      currentInstance = createPopover(target, keyData, content, { trigger });
      currentInstance?.show();
    }
  };

  const handleMouseLeave = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target.classList.contains(PopoverKey)) {
      if ((target as any)._tippy?.destroy) {
        (target as any)._tippy.destroy();
      }
      currentInstance?.destroy();
      currentInstance = null
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
