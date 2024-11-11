import { SelectionRule } from "@/config/config";

function matchesRule(element: Element, rule: SelectionRule): boolean {
  if (rule.tag && element.tagName.toLowerCase() === rule.tag.toLowerCase()) return true;
  if (rule.id && element.id === rule.id) return true;
  if (rule.class && element.classList.contains(rule.class)) return true;
  if (rule.func && rule.func(element)) return true;
  return false;
}

export function shouldProcessNode(
  element: Element,
  include?: SelectionRule[],
  exclude?: SelectionRule[]
): boolean {
  if (!element) return false;
  if (element.nodeType !== 1) return false;
  // TODO: include存在问题，上层节点include，无法在下层节点判断
  // if (include && include.length > 0) {
  //   return include.some((rule) => matchesRule(element, rule));
  // }
  
  if (exclude && exclude.length > 0) {
    return !exclude.some((rule) => matchesRule(element, rule));
  }
  return true;
}
