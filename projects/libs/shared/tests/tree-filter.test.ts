import { describe, expect, it, vi } from 'vitest';

import { filterTreeList } from '../utils/filter-tree-list';

interface TreeNode {
  id: number;
  name: string;
  type?: 'file' | 'directory';
  children?: TreeNode[];
}

describe('filterTreeList', () => {
  const createTree = (): TreeNode[] => [
    {
      id: 1,
      name: 'Documents',
      type: 'directory',
      children: [
        {
          id: 2,
          name: 'Reports',
          type: 'directory',
          children: [
            {
              id: 3,
              name: 'Q1 Report.docx',
              type: 'file',
            },
            {
              id: 4,
              name: 'Q2 Report.docx',
              type: 'file',
            },
          ],
        },
        {
          id: 5,
          name: 'Images',
          type: 'directory',
          children: [
            {
              id: 6,
              name: 'logo.png',
              type: 'file',
            },
          ],
        },
      ],
    },
    {
      id: 7,
      name: 'Projects',
      type: 'directory',
      children: [
        {
          id: 8,
          name: 'Angular',
          type: 'directory',
          children: [
            {
              id: 9,
              name: 'app.component.ts',
              type: 'file',
            },
          ],
        },
      ],
    },
  ];

  it('should return an empty array for an empty tree', () => {
    expect(filterTreeList([], () => true)).toEqual([]);
  });

  it('should return an empty array when data is undefined', () => {
    expect(filterTreeList(undefined, () => true)).toEqual([]);
  });

  it('should return an empty array when data is null', () => {
    expect(filterTreeList(null, () => true)).toEqual([]);
  });

  it('should return matching root nodes', () => {
    const data = createTree();

    const result = filterTreeList(data, (node) => node.name === 'Documents');

    expect(result).toHaveLength(1);
    expect(result[0]).toBe(data[0]);
  });

  it('should preserve the complete subtree when a node itself matches', () => {
    const data = createTree();

    const result = filterTreeList(data, (node) => node.name === 'Reports');

    expect(result).toEqual([
      {
        id: 1,
        name: 'Documents',
        type: 'directory',
        children: [
          {
            id: 2,
            name: 'Reports',
            type: 'directory',
            children: [
              {
                id: 3,
                name: 'Q1 Report.docx',
                type: 'file',
              },
              {
                id: 4,
                name: 'Q2 Report.docx',
                type: 'file',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should preserve the path to a matching descendant', () => {
    const data = createTree();

    const result = filterTreeList(data, (node) => node.name === 'Q2 Report.docx');

    expect(result).toEqual([
      {
        id: 1,
        name: 'Documents',
        type: 'directory',
        children: [
          {
            id: 2,
            name: 'Reports',
            type: 'directory',
            children: [
              {
                id: 4,
                name: 'Q2 Report.docx',
                type: 'file',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should remove unrelated branches', () => {
    const data = createTree();

    const result = filterTreeList(data, (node) => node.name === 'logo.png');

    expect(result).toEqual([
      {
        id: 1,
        name: 'Documents',
        type: 'directory',
        children: [
          {
            id: 5,
            name: 'Images',
            type: 'directory',
            children: [
              {
                id: 6,
                name: 'logo.png',
                type: 'file',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should support multiple matching branches', () => {
    const data = createTree();

    const result = filterTreeList(
      data,
      (node) => node.name === 'Q1 Report.docx' || node.name === 'logo.png',
    );

    expect(result).toEqual([
      {
        id: 1,
        name: 'Documents',
        type: 'directory',
        children: [
          {
            id: 2,
            name: 'Reports',
            type: 'directory',
            children: [
              {
                id: 3,
                name: 'Q1 Report.docx',
                type: 'file',
              },
            ],
          },
          {
            id: 5,
            name: 'Images',
            type: 'directory',
            children: [
              {
                id: 6,
                name: 'logo.png',
                type: 'file',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should return an empty array when nothing matches', () => {
    const data = createTree();

    const result = filterTreeList(data, (node) => node.name === 'Not Found');

    expect(result).toEqual([]);
  });

  it('should support custom children key names', () => {
    const data = [
      {
        id: 1,
        name: 'Root',
        items: [
          {
            id: 2,
            name: 'Child',
            items: [
              {
                id: 3,
                name: 'Target',
              },
            ],
          },
        ],
      },
    ];

    const result = filterTreeList(data, (node) => node.name === 'Target', {
      childrenKeyName: 'items',
    });

    expect(result).toEqual([
      {
        id: 1,
        name: 'Root',
        items: [
          {
            id: 2,
            name: 'Child',
            items: [
              {
                id: 3,
                name: 'Target',
              },
            ],
          },
        ],
      },
    ]);
  });

  it('should support nodes without children', () => {
    const data = [
      {
        id: 1,
        name: 'Root',
      },
      {
        id: 2,
        name: 'Target',
      },
    ];

    const result = filterTreeList(data, (node) => node.name === 'Target');

    expect(result).toEqual([
      {
        id: 2,
        name: 'Target',
      },
    ]);
  });

  it('should preserve the original data structure', () => {
    const data = createTree();
    const original = structuredClone(data);

    filterTreeList(data, (node) => node.name === 'Q2 Report.docx');

    expect(data).toEqual(original);
  });

  it('should preserve object references for matching nodes', () => {
    const data = createTree();

    const result = filterTreeList(data, (node) => node.name === 'Q2 Report.docx');

    const matchedNode = result[0].children![0].children![0];

    expect(matchedNode).toBe(data[0].children![0].children![1]);
  });

  it('should create new objects only for parents whose children changed', () => {
    const data = createTree();

    const result = filterTreeList(data, (node) => node.name === 'Q2 Report.docx');

    expect(result[0]).not.toBe(data[0]);
    expect(result[0].children![0]).not.toBe(data[0].children![0]);

    expect(result[0].children![0].children![0]).toBe(data[0].children![0].children![1]);
  });

  it('should call the filter function for each visited node', () => {
    const data = createTree();
    const filterFn = vi.fn(() => false);

    filterTreeList(data, filterFn);

    expect(filterFn).toHaveBeenCalledTimes(10);
  });

  it('should stop traversing a matching subtree', () => {
    const data = createTree();
    const filterFn = vi.fn((node) => node.name === 'Documents');

    filterTreeList(data, filterFn);

    expect(filterFn).toHaveBeenCalledWith(data[0]);
    expect(filterFn).toHaveBeenCalledWith(data[1]);

    expect(filterFn.mock.calls.some(([node]) => node.name === 'Reports')).toBe(false);

    expect(filterFn.mock.calls.some(([node]) => node.name === 'Q1 Report.docx')).toBe(false);
  });

  it('should work with a case-insensitive search', () => {
    const data = createTree();

    const filter = 'angular';

    const result = filterTreeList(data, (node) => node.name.toLowerCase().includes(filter));

    expect(result).toEqual([
      {
        id: 7,
        name: 'Projects',
        type: 'directory',
        children: [
          {
            id: 8,
            name: 'Angular',
            type: 'directory',
            children: [
              {
                id: 9,
                name: 'app.component.ts',
                type: 'file',
              },
            ],
          },
        ],
      },
    ]);
  });
});
