import type { FindConfig } from './type';
import type { GlobalConfig, SelectionRule } from '@/config';

function matchesRule(element: Element, rule: SelectionRule): boolean {
  if (rule.tag && element.tagName.toLowerCase() !== rule.tag.toLowerCase()) return false;
  if (rule.id && element.id !== rule.id) return false;
  if (rule.class && !element.classList.contains(rule.class)) return false;
  return true;
}

function shouldProcessNode(
  element: Element,
  include?: SelectionRule[],
  exclude?: SelectionRule[]
): boolean {
  if (include && include.length > 0) {
    return include.some((rule) => matchesRule(element, rule));
  }
  if (exclude && exclude.length > 0) {
    return !exclude.some((rule) => matchesRule(element, rule));
  }
  return true;
}

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
