import { Component, OnInit, signal, ViewEncapsulation } from '@angular/core';
import {
  ExampleShowcaseComponent,
  type ExampleSourceFile,
} from '@demo/shared/showcase/example-showcase.component';
import { NgxVirtualScrollViewport } from 'ngx-kit/virtual-scroll';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    NgxVirtualScrollViewport,
    ExampleShowcaseComponent, 
    FormsModule,
    ScrollingModule,
  ],
})
export class VirtualScrollComponent {
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
  ];

  maximum = 1000000;
  items: string[] = Array.from<number>({ length: this.maximum }).map((_, i) => `Item ${i + 1}`);
}
