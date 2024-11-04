/**
 * 表示网页元素弹出框的全局配置。
 */
export interface GlobalConfig {
  /**
   * 可选的元素选择规则。
   */
  rules?: ElementSelectionRules;

  /**
   * 配置中使用的键数组。
   */
  keys: string[];

  /**
   * 可选的周期性操作间隔值（以毫秒为单位）。
   */
  interval?: number;

  /**
   * 可选的基于给定键执行的函数。
   * @param key - 用于执行的键。
   * @returns 执行结果的字符串。
   */
  executeFunc?: (key: string) => string;
}

export const defaultConfig: GlobalConfig = {
  rules: {
    include: [],
    exclude: [],
  },
  keys: [],
};

export interface ElementSelectionRules {
  include?: SelectionRule[];
  exclude?: SelectionRule[];
}

export interface SelectionRule {
  tag?: string;
  id?: string;
  class?: string;
  func?: (ele: Element) => boolean;
}
