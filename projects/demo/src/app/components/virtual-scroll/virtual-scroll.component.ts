import { Component, OnInit, signal } from '@angular/core';
import {
  ExampleShowcaseComponent,
  type ExampleSourceFile,
} from '@demo/shared/showcase/example-showcase.component';
import { NgxVirtualScrollModule } from 'ngx-kit/virtual-scroll';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-virtual-scroll',
  templateUrl: './virtual-scroll.component.html',
  styleUrls: ['./virtual-scroll.component.scss'],
  imports: [
    CommonModule,
    NgxVirtualScrollModule,
    ExampleShowcaseComponent,
    MatCheckbox,
    FormsModule,
  ],
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
  ];

  enableVirtualScrolling = signal(true);

  maximum = 1000000;
  items: string[] = [];
  constructor() {
    for (let i = 0; i <= this.maximum; i++) {
      this.items.push(`Item ${i}`);
    }
  }

  ngOnInit() {}

  trackByFn(index: number, item: string) {}
}
