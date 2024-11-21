import setup, { Popover } from '../src/index';

// 性能测试
function generateKeys(count: number): string[] {
  return Array.from({ length: count }, (_, index) => `key${index}`);
}
document.body.onload = () => {
  const { start, end } = setup(
    document.getElementById('display-box')!,
    {
      keys: generateKeys(10),
      rules: {
        exclude: [
          {
            class: 'exclude',
          },
          {
            id: 'exclude',
          },
          {
            func: (ele) => ele.getAttribute('data-key') === 'exclude',
          },
        ],
      },
    },
    [
      Popover({
        trigger: 'hover',
        keyRender: () => true,
        // TODO: 这种情况存在tippy上再次tippy的问题
        content: async (key) => `名称: ${key}`,
        options: {
          delay: [1000, 500],
        },
      }),
    ]
  );
  start();
};
