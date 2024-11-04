import { shouldProcessNode } from '@/utils/filter';
import type { FindConfig } from './type';
import { GlobalConfig } from '@/config/config';

class Finder {
  config: FindConfig = {};
  globalConfig: GlobalConfig;

  constructor(config: FindConfig, globalConfig: GlobalConfig) {
    this.config = { ...config };
    this.globalConfig = globalConfig;
  }

  findInDom(node: HTMLElement) {
    const result: Map<HTMLElement, string[]> = new Map();
    const treeWalker = document.createTreeWalker(
      node,
      NodeFilter.SHOW_TEXT,
      {
        acceptNode: (node) => {
          // TODO: 对于popover的筛选还不太好
          if (node.parentElement && shouldProcessNode(
            node.parentElement,
            this.globalConfig.rules?.include,
            this.globalConfig.rules?.exclude
          )) {
            return NodeFilter.FILTER_ACCEPT;
          }
          return NodeFilter.FILTER_REJECT;
        }
      }
    );
  
    while (treeWalker.nextNode()) {
      const textNode = treeWalker.currentNode as Text;
      const parentElement = textNode.parentElement as HTMLElement;
      const text = textNode.textContent?.trim();
  
      if (!text) continue;
  
      const matches: string[] = [];
      for (const key of this.globalConfig.keys) {
        if (text.includes(key)) {
          matches.push(key);
        }
      }
  
      if (matches.length > 0) {
        if (result.has(parentElement)) {
          const existingMatches = result.get(parentElement)!;
          matches.forEach(match => existingMatches.push(match));
        } else {
          result.set(parentElement, matches);
        }
      }
    }
  
    return result;
  }

  findInText() {}

  destroy() {
    this.config = null as any;
    this.globalConfig = null as any;
  }
}

export default Finder;
