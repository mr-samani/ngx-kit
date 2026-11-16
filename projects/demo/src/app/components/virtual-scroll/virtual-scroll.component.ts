import { Component, ViewEncapsulation, type OnInit } from '@angular/core';
import {
  ExampleShowcaseComponent,
  ExampleSourceFile,
} from '@demo/shared/showcase/example-showcase.component';
import { NgxVirtualScrollViewport } from 'ngx-kit/virtual-scroll';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, NgxVirtualScrollViewport, ExampleShowcaseComponent, ScrollingModule],
})
export class VirtualScrollComponent implements OnInit {
  protected readonly sourceFiles: ExampleSourceFile[] = [
    {
      label: 'TS',
      path: 'examples/virtual-scroll/virtual-scroll.component.ts',
      language: 'typescript',
    },
    {
      label: 'HTML',
      path: 'examples/virtual-scroll/virtual-scroll.component.html',
      language: 'html',
    },
    {
      label: 'SCSS',
      path: 'examples/virtual-scroll/virtual-scroll.component.scss',
      language: 'scss',
    },
  ];

  maximum = 100000;
  items: string[] = [];
  ngOnInit(): void {
    this.items = Array.from<number>({ length: this.maximum }).map((_, i) => `Item ${i + 1}`);
  }

  setMaximum(event: Event): void {
    const value = Number((event.currentTarget as HTMLSelectElement).value);
    this.maximum = value;
    this.items = Array.from<number>({ length: value }).map((_, i) => `Item ${i + 1}`);
  }
}
