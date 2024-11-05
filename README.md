<div>
  <div align="center">
    <h1>Web Element Popover</h1>
    <p>The auto popover solution for the web</p>
    <br>
    <div>
    <a href="https://www.npmjs.com/package/web-element-popover">
    <img src="https://img.shields.io/npm/dm/tippy.js.svg?color=%235599ff&style=for-the-badge" alt="npm Downloads">
    <a>
    <a href="https://github.com/senmacn/web-element-popover/blob/master/LICENSE">
      <img src="https://img.shields.io/npm/l/tippy.js.svg?color=%23c677cf&style=for-the-badge" alt="MIT License">
    </a>
    <br>
  </div>
</div>

## Description

自动匹配页面中指定的内文本，无侵入的创建 Popover 方便进行显示详情、描述、额外功能等。

- 无代码侵入性
- 自动捕获页面更新
- 支持多种规则匹配
- 性能优！
- 支持 Typescript

## Usage

```typescript
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
```

## Demo

```bash
npm run demo
```

## Build

```bash
npm run build
```

## License

MIT
