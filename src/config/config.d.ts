export interface GlobalConfig {
  rules?: ElementSelectionRules;
  keys: string[];
  executeFunc?: (key: string) => string;
}

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

