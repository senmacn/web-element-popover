import setup, { Popover } from '../src/index';

document.body.onload = () => {
  const { start, end } = setup(document.body, { keys: ['key1', 'key2'] }, [
    Popover({
      trigger: 'hover',
      content: async (key) => `<div>名称: ${key}</div>`,
    }),
  ]);
  start();
};
