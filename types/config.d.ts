declare global {
  interface GlobalConfig {
    rules?: ElementSelectionRules;
    keys: string[];
    executeFunc?: (key: string) => string;
  }

  interface ElementSelectionRules {
    include?: SelectionRule[];
    exclude?: SelectionRule[];
  }

  interface SelectionRule {
    tag?: string;
    id?: string;
    class?: string;
  }
}

export {};
