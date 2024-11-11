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
  { tag: 'span', class: PopoverKey },
  {
    func: (ele: any) =>
      !!ele._tippy || ele.id.includes('tippy-') || ele.className.includes('tippy-'),
  },
];
