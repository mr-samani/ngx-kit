import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TreeModel } from './tree.model';
import { filterTreeList } from 'ngx-kit/core';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '../../shared/showcase/example-showcase.component';

@Component({
  selector: 'app-filter-tree-list',
  templateUrl: './tree-list.component.html',
  styleUrls: ['./tree-list.component.scss'],
  imports: [FormsModule, ExampleShowcaseComponent],
})
export class DemoTreeList implements OnInit {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    { label: 'TS', path: 'examples/tree-list/tree-list.component.ts', language: 'typescript' },
    { label: 'HTML', path: 'examples/tree-list/tree-list.component.html', language: 'html' },
    { label: 'SCSS', path: 'examples/tree-list/tree-list.component.scss', language: 'scss' },
    { label: 'TS', path: 'examples/tree-list/tree.model.ts', language: 'typescript' },
  ];

  filter = signal('');
  result = signal('');
  dataTree: TreeModel[] = [
    {
      name: 'Documents',
      type: 'directory',
      children: [
        {
          name: 'Reports',
          type: 'directory',
          children: [
            {
              name: 'Q1 Report.docx',
              type: 'file',
            },
            {
              name: 'Q2 Report.docx',
              type: 'file',
            },
          ],
        },
        {
          name: 'Invoices',
          type: 'directory',
          children: [
            {
              name: 'Invoice 001.pdf',
              type: 'file',
            },
            {
              name: 'Invoice 002.pdf',
              type: 'file',
            },
            {
              name: 'Invoice 003.pdf',
              type: 'file',
            },
          ],
        },
        {
          name: 'Notes.txt',
          type: 'file',
        },
      ],
    },
    {
      name: 'Pictures',
      type: 'directory',
      children: [
        {
          name: 'Vacation',
          type: 'directory',
          children: [
            {
              name: 'Beach.jpg',
              type: 'file',
            },
            {
              name: 'Mountain.jpg',
              type: 'file',
            },
          ],
        },
        {
          name: 'Family',
          type: 'directory',
          children: [
            {
              name: 'Siblings.jpg',
              type: 'file',
            },
            {
              name: 'Parents.jpg',
              type: 'file',
            },
          ],
        },
      ],
    },
  ];

  ngOnInit(): void {
    this.filterTree();
  }

  filterTree() {
    var filter = this.filter().toLowerCase();
    var expression = (x: TreeModel) =>
      x.name.toLowerCase().includes(filter) || x.type.toLowerCase().includes(filter);
    var result = filterTreeList(this.dataTree, expression, { childrenKeyName: 'children' });
    this.print(result);
  }

  /*-----------------------------------------------------------------------*/

  print(data: any) {
    var src = JSON.stringify(data, undefined, 2);
    this.result.set(syntaxHighlight(src));
  }

  onFilterChange(value: string) {
    this.filter.set(value);
    this.filterTree();
  }
}

function syntaxHighlight(json: string): string {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    function (match: string) {
      var cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return '<span class="' + cls + '">' + match + '</span>';
    },
  );
}
