import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

const PopoverKey = 'tippy-tippy';

function createPopover(
  element: HTMLElement,
  content: string | (() => Promise<string>),
  options?: {
    defaultContent?: string;
  }
) {
  let instance;
  if (typeof content === 'string') {
    instance = tippy(
      element,
      Object.assign(
        {
          content,
          allowHTML: true,
          arrow: true,
        },
        options
      )
    );
  }
  if (typeof content === 'function') {
    instance = tippy(
      element,
      Object.assign(
        {
          allowHTML: true,
          arrow: true,
          content: options?.defaultContent || '',
          onShow(instance: any) {
            content()
              .then((str) => {
                instance.setContent(str);
              })
              .catch((error) => {
                instance.setContent('Request failed.');
              });
          },
        },
        options
      )
    );
  }
  return instance;
}

function executeFindElement(key: string) {
  return `<span class=${PopoverKey}>${key}</span>`;
}

function getTriggerEvent(trigger: string) {
  if (trigger === 'click') return 'click';
  if (trigger === 'hover') return 'mouseenter';
  console.error(`Invalid trigger: ${trigger}. Defaulting to 'click' as a fallback.`);
  return 'click';
}

function Popover({
  trigger = 'click',
  content,
}: {
  trigger: 'click' | 'hover';
  content: string | (() => Promise<string>);
}) {
  let popoverListener: any;
  return {
    init(globalConfig: GlobalConfig) {
      globalConfig.executeFunc = executeFindElement;
      const popoverListener = (event: MouseEvent) => {
        if ((event.target as HTMLElement).classList.contains(PopoverKey)) {
          createPopover(event.target as HTMLElement, content);
        }
      };
      document.body.addEventListener(getTriggerEvent(trigger), popoverListener);
    },
    destroy() {
      document.body.removeEventListener(getTriggerEvent(trigger), popoverListener);
    },
  };
}

export default Popover;
