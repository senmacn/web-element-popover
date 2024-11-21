import { shouldProcessNode } from '@/utils/filter';
import type { FindConfig } from './type';
import { GlobalConfig } from '@/config/config';

export type ExecuteNode = Text | HTMLElement;

class Finder {
  private config: FindConfig = {};
  private globalConfig: GlobalConfig;
  private regexCache: Map<string, RegExp>;
  private resultMap: Map<ExecuteNode, string[]>;

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
        if (
          shouldProcessNode(
            node.parentElement!,
            this.globalConfig.rules?.include,
            this.globalConfig.rules?.exclude
          )
        ) {
          this.processTextNode(node);
        }
      }

      const nodeIterator = document.createNodeIterator(node, NodeFilter.SHOW_ELEMENT, {
        acceptNode: this.acceptNode.bind(this),
      });

      let currentNode;
      while ((currentNode = nodeIterator.nextNode() as HTMLElement)) {
        this.processElement(currentNode);
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

  private processElement(element: HTMLElement) {
    for (let child of element.childNodes) {
      if (child.nodeType === Node.TEXT_NODE) {
        this.processTextNode(child as Text);
      }
    }
  }

  private processTextNode(textNode: Text) {
    const parentElement = textNode.parentElement as HTMLElement;
    const text = textNode.textContent?.trim();

    if (!text) return;

    const matches = this.findMatches(text);

    if (matches.length > 0) {
      this.updateResult(textNode, matches);
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

  private updateResult(element: Text | HTMLElement, matches: string[]) {
    if (this.resultMap.has(element)) {
      const existingMatches = this.resultMap.get(element)!;
      matches.forEach((match) => existingMatches.push(match));
    } else {
      this.resultMap.set(element, matches);
    }
  }

  destroy() {
    this.config = null as any;
    this.globalConfig = null as any;
    this.regexCache = null as any;
  }
}

export default Finder;
