/**
 * Filters a hierarchical tree while preserving the branches
 * that contain matching nodes.
 *
 * A node is included when:
 * - the filter function matches the node itself, or
 * - one or more of its descendants match.
 *
 * When only a descendant matches, a shallow copy of the parent
 * is returned with only the matching descendants preserved.
 *
 * @param data The tree nodes to filter.
 * @param filterFn Function used to determine whether a node matches.
 * @param options Optional filtering configuration.
 *
 * @example
 * ```ts
 * const result = filterTreeList(
 *   dataTree,
 *   item =>
 *     item.name.toLowerCase().includes(filter) ||
 *     item.type.toLowerCase().includes(filter),
 * );
 * ```
 *
 * @example
 * ```ts
 * const result = filterTreeList(
 *   data,
 *   item => item.title.includes('angular'),
 *   { childrenKeyName: 'items' },
 * );
 * ```
 */
export function filterTreeList<T extends Record<string, any>>(
  data: readonly T[] | null | undefined,
  filterFn: (item: T) => boolean,
  options?: {
    childrenKeyName?: string;
  },
): T[] {
  if (!data?.length) {
    return [];
  }

  const childrenKeyName = options?.childrenKeyName ?? 'children';

  return filterNodes(data, filterFn, childrenKeyName);
}

function filterNodes<T extends Record<string, any>>(
  nodes: readonly T[],
  filterFn: (item: T) => boolean,
  childrenKeyName: string,
): T[] {
  const result: T[] = [];

  for (const node of nodes) {
    if (filterFn(node)) {
      result.push(node);
      continue;
    }

    const children = node[childrenKeyName];

    if (!Array.isArray(children) || children.length === 0) {
      continue;
    }

    const filteredChildren = filterNodes(children, filterFn, childrenKeyName);

    if (filteredChildren.length > 0) {
      result.push({
        ...node,
        [childrenKeyName]: filteredChildren,
      });
    }
  }

  return result;
}
