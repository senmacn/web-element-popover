import { SelectionRule } from "@/config/config";

function matchesRule(element: Element, rule: SelectionRule): boolean {
  if (rule.tag && element.tagName.toLowerCase() !== rule.tag.toLowerCase()) return false;
  if (rule.id && element.id !== rule.id) return false;
  if (rule.class && !element.classList.contains(rule.class)) return false;
  if (rule.func && !rule.func(element)) return false;
  return true;
}

export function shouldProcessNode(
  element: Element,
  include?: SelectionRule[],
  exclude?: SelectionRule[]
): boolean {
  if (element.nodeType !== 1) return true;
  if (include && include.length > 0) {
    return include.some((rule) => matchesRule(element, rule));
  }
  if (exclude && exclude.length > 0) {
    return !exclude.some((rule) => matchesRule(element, rule));
  }
  return true;
}
