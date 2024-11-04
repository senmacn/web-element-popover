import { GlobalConfig } from '@/config/config';
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
    { trigger: options?.trigger || 'hover', allowHTML: true, arrow: true, delay: [100, 100] as [number, number] },
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
            instance.setContent('Request failed.');
          });
      },
      ..._options,
    });
  }
  return instance;
}

function executeFindElement(key: string) {
  return `<span class=${PopoverKey} ${PopoverKeyData}=${key}>${key}</span>`;
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

function Popover({
  trigger = 'click',
  content,
}: {
  trigger: 'click' | 'hover';
  content: ContentType;
}) {
  let popoverListener: any;
  let popoverMouseLeaveListener: any;
  let currentInstance: any;
  return {
    init(globalConfig: GlobalConfig) {
      globalConfig.executeFunc = executeFindElement;
      if (globalConfig.rules && globalConfig.rules.exclude) {
        globalConfig.rules.exclude = globalConfig.rules.exclude.concat(excludeItems);
      } else {
        globalConfig.rules = {
          ...globalConfig.rules,
          exclude: [...excludeItems],
        };
      }
      popoverListener = (event: MouseEvent) => {
        if ((event.target as HTMLElement).classList.contains(PopoverKey)) {
          const keyData = (event.target as HTMLElement).getAttribute(PopoverKeyData) || '';
          currentInstance = createPopover(event.target as HTMLElement, keyData, content, {
            trigger: trigger,
          });
          currentInstance?.show();
        }
      };
      popoverMouseLeaveListener = (event: any) => {
        if ((event.target as HTMLElement).classList.contains(PopoverKey)) {
          if (event.target._tippy) {
            event.target._tippy.destroy && event.target._tippy.destroy();
          }
          if (currentInstance) {
            currentInstance.destroy();
          }
        }
      };
      document.body.addEventListener(getTriggerEvent(trigger), popoverListener);
      document.body.addEventListener('mouseleave', popoverMouseLeaveListener, true);
    },
    destroy() {
      document.body.removeEventListener(getTriggerEvent(trigger), popoverListener);
      document.body.removeEventListener('mouseleave', popoverMouseLeaveListener, true);
    },
  };
}

export default Popover;
