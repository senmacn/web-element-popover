import { PopoverProps, ContentType } from './constants';
import tippy from 'tippy.js';

export function createPopover(
  element: HTMLElement,
  keyData: string,
  content: ContentType,
  options?: PopoverProps
) {
  let instance = null;
  const _options = Object.assign(
    {
      allowHTML: true,
      arrow: true,
      interactive: true,
      delay: [150, 200] as [number, number],
    },
    options || {},
    { trigger: options?.trigger || 'hover' }
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

export function getTriggerEvent(trigger: string) {
  if (trigger === 'click') return 'click';
  if (trigger === 'hover') return 'mouseover';
  console.error(`Invalid trigger: ${trigger}. Defaulting to 'click' as a fallback.`);
  return 'click';
}