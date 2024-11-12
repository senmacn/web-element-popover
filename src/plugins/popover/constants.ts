export const PopoverKey = 'tippy-tippy';
export const PopoverBoxKey = 'tippy-box';
export const PopoverKeyData = 'tippy-data';

export type ContentType = string | ((keyData: string) => Promise<string>);

export type PopoverProps = {
  defaultContent?: string;
  trigger?: string;
  interactive?: boolean;
} & Partial<import('tippy.js').Props>;

export const excludeItems = [
  { class: PopoverKey },
  {
    func: (ele: any) => {
      if (ele instanceof HTMLElement) {
        return (
          !!(ele as any)._tippy ||
          (ele.id && ele.id.includes('tippy-')) ||
          ele.className.includes('tippy-')
        );
      }
      return true;
    },
  },
];
