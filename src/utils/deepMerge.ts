type DeepMergeOptions = {
  arrayMode?: 'replace' | 'concat' | 'concatUnique';
};

const defaultOptions: DeepMergeOptions = {
  arrayMode: 'replace',
};

export function isObject(item: any): boolean {
  return item && typeof item === 'object' && !Array.isArray(item);
}

export default function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>,
  options: Partial<DeepMergeOptions> = {}
): T {
  const mergeOptions: DeepMergeOptions = { ...defaultOptions, ...options };

  if (!isObject(target) || !isObject(source)) {
    return source as T;
  }

  Object.keys(source).forEach((key) => {
    const targetValue = target[key];
    const sourceValue = source[key];

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      switch (mergeOptions.arrayMode) {
        case 'replace':
          Reflect.set(target, key, sourceValue);
          break;
        case 'concat':
          Reflect.set(target, key, targetValue.concat(sourceValue));
          break;
        case 'concatUnique':
          Reflect.set(target, key, Array.from(new Set(targetValue.concat(sourceValue))));
          break;
      }
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      Reflect.set(target, key, deepMerge(Object.assign({}, targetValue), sourceValue as any, options));
    } else {
      Reflect.set(target, key, sourceValue);
    }
  });

  return target;
}
