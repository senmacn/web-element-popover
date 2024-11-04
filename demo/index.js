import setup, { Popover } from '../dist/lib.es';

document.body.onload = () => {
  const { start, end } = setup(document.body, { keys: ['key1', 'key2'],  }, [
    Popover({
      trigger: 'hover',
      content: async (key) => `<div>名称: ${key}</div>`,
    }),
    
  ]);
  start();
};
