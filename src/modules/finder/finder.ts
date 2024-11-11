import { shouldProcessNode } from '@/utils/filter';
import type { FindConfig } from './type';
import { GlobalConfig } from '@/config/config';

class Finder {
  private config: FindConfig = {};
  private globalConfig: GlobalConfig;
  private regexCache: Map<string, RegExp>;
  private resultMap: Map<HTMLElement, string[]>;

  constructor(config: FindConfig, globalConfig: GlobalConfig) {
    if (!globalConfig || !globalConfig.keys) {
      throw new Error('Invalid global configuration');
    }
    this.config = { ...config };
    this.globalConfig = globalConfig;
    this.regexCache = new Map();
    this.resultMap = new Map();
  }

  findInDom(node: HTMLElement) {
    this.resultMap.clear();
    try {
      if (node instanceof Text) {
        this.processTextNode(node, this.resultMap);
      }

      const nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT, {
        acceptNode: this.acceptNode.bind(this),
      });

      let currentNode;
      while ((currentNode = nodeIterator.nextNode() as HTMLElement)) {
        this.processElement(currentNode, this.resultMap);
      }
    } catch (error) {
      console.error('Error in findInDom:', error);
    }

    return this.resultMap;
  }

  private acceptNode(node: Node): number {
    if (node.nodeType === Node.ELEMENT_NODE) {
      const element = node as HTMLElement;

      // 排除 script, style 等标签
      if (element.tagName.toLowerCase() === 'script' || element.tagName.toLowerCase() === 'style') {
        return NodeFilter.FILTER_REJECT;
      }

      if (
        shouldProcessNode(
          element,
          this.globalConfig.rules?.include,
          this.globalConfig.rules?.exclude
        )
      ) {
        return NodeFilter.FILTER_ACCEPT;
      }
    }
    return NodeFilter.FILTER_SKIP;
  }

  private processElement(element: HTMLElement, result: Map<HTMLElement, string[]>) {
    for (let child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        this.processTextNode(child as Text, result);
      }
    }
  }

  private processTextNode(textNode: Text, result: Map<HTMLElement, string[]>) {
    const parentElement = textNode.parentElement as HTMLElement;
    const text = textNode.textContent?.trim();

    if (!text) return;

    const matches = this.findMatches(text);

    if (matches.length > 0) {
      this.updateResult(parentElement, matches, result);
    }
  }

  private findMatches(text: string): string[] {
    const processedText = this.globalConfig.ignoreCase ? text.toLowerCase() : text;
    const result = this.globalConfig.keys.filter((key) => {
      if (key === processedText) return true;
      const regex = this.getOrCreateRegex(key);
      return regex.test(processedText);
    });
    const result1 = this.globalConfig.keys.filter((key) => {
      if (key === processedText) return true;
      const regex = this.getOrCreateRegex(key);
      return regex.test(processedText);
    });
    return this.globalConfig.keys.filter((key) => {
      if (key === processedText) return true;
      const regex = this.getOrCreateRegex(key);
      return regex.test(processedText);
    });
  }

  private getOrCreateRegex(key: string): RegExp {
    if (!this.regexCache.has(key)) {
      const flags = this.globalConfig.ignoreCase ? 'i' : '';
      this.regexCache.set(key, new RegExp(`\\b${key}\\b`, flags));
    }
    return this.regexCache.get(key)!;
  }

  private updateResult(
    element: HTMLElement,
    matches: string[],
    result: Map<HTMLElement, string[]>
  ) {
    if (result.has(element)) {
      const existingMatches = result.get(element)!;
      matches.forEach((match) => existingMatches.push(match));
    } else {
      result.set(element, matches);
    }
  }

  destroy() {
    this.config = null as any;
    this.globalConfig = null as any;
    this.regexCache = null as any;
  }
}

export default Finder;
