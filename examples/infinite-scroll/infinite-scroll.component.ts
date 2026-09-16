import { Component, OnInit, signal } from '@angular/core';
import { NgxInfiniteScroll, NgxInfiniteScrollEvent } from 'ngx-kit/infinite-scroll';
interface DemoItem {
  id: number;
  title: string;
  text: string;
  meta: string;
}

interface ChatMessage {
  id: number;
  author: string;
  text: string;
  time: string;
}
@Component({
  selector: 'app-infinite-scroll',
  templateUrl: './infinite-scroll.component.html',
  styleUrls: ['./infinite-scroll.component.scss'],
  imports: [NgxInfiniteScroll],
})
export class InfiniteScrollComponent {
  readonly activeDemo = signal<'down' | 'window' | 'chat' | 'both'>('down');

  readonly downItems = signal<DemoItem[]>(this.makeItems(1, 18));
  readonly downLoading = signal(false);
  readonly downEnd = signal(false);
  readonly downRequests = signal(0);

  readonly windowItems = signal<DemoItem[]>(this.makeItems(1000, 16));
  readonly windowLoading = signal(false);
  readonly windowEnd = signal(false);
  readonly windowRequests = signal(0);

  readonly messages = signal<ChatMessage[]>(this.makeMessages(80, 25));
  readonly chatLoading = signal(false);
  readonly chatBeginning = signal(false);
  readonly chatRequests = signal(0);

  readonly bothItems = signal<DemoItem[]>(this.makeItems(400, 24));
  readonly bothTopLoading = signal(false);
  readonly bothBottomLoading = signal(false);
  readonly bothTopEnd = signal(false);
  readonly bothBottomEnd = signal(false);
  readonly bothRequests = signal(0);

  private nextId = 5000;

  setDemo(demo: 'down' | 'window' | 'chat' | 'both'): void {
    this.activeDemo.set(demo);
  }

  loadDown(): void {
    if (this.downLoading() || this.downEnd()) return;
    this.downLoading.set(true);
    this.downRequests.update((value) => value + 1);

    window.setTimeout(() => {
      const current = this.downItems().length;
      const page = this.makeItems(current + 1, 14);
      this.downItems.update((items) => [...items, ...page]);
      if (this.downItems().length >= 70) this.downEnd.set(true);
      this.downLoading.set(false);
    }, 650);
  }

  loadWindow(event: NgxInfiniteScrollEvent): void {
    if (event.direction !== 'down' || this.windowLoading() || this.windowEnd()) return;
    this.windowLoading.set(true);
    this.windowRequests.update((value) => value + 1);

    window.setTimeout(() => {
      const start = this.windowItems().length + 1000;
      this.windowItems.update((items) => [...items, ...this.makeItems(start, 18)]);
      if (this.windowItems().length >= 90) this.windowEnd.set(true);
      this.windowLoading.set(false);
    }, 500);
  }

  loadOlderMessages(): void {
    if (this.chatLoading() || this.chatBeginning()) return;
    this.chatLoading.set(true);
    this.chatRequests.update((value) => value + 1);

    window.setTimeout(() => {
      const firstId = this.messages()[0]?.id ?? 80;
      const older = this.makeMessages(firstId - 18, 18);
      this.messages.update((items) => [...older, ...items]);
      if (older[0]?.id <= 1) this.chatBeginning.set(true);
      this.chatLoading.set(false);
    }, 650);
  }

  loadBoth(event: NgxInfiniteScrollEvent): void {
    if (event.direction === 'up') {
      if (this.bothTopLoading() || this.bothTopEnd()) return;
      this.bothTopLoading.set(true);
      this.bothRequests.update((value) => value + 1);
      window.setTimeout(() => {
        const first = this.bothItems()[0]?.id ?? 400;
        const older = this.makeItems(Math.max(1, first - 12), 12);
        this.bothItems.update((items) => [...older, ...items]);
        if (older[0]?.id <= 1) this.bothTopEnd.set(true);
        this.bothTopLoading.set(false);
      }, 600);
      return;
    }

    if (this.bothBottomLoading() || this.bothBottomEnd()) return;
    this.bothBottomLoading.set(true);
    this.bothRequests.update((value) => value + 1);
    window.setTimeout(() => {
      const last = this.bothItems()[this.bothItems().length - 1]?.id ?? 400;
      this.bothItems.update((items) => [...items, ...this.makeItems(last + 1, 12)]);
      if (this.bothItems().length >= 100) this.bothBottomEnd.set(true);
      this.bothBottomLoading.set(false);
    }, 600);
  }

  trackById(_: number, item: DemoItem | ChatMessage): number {
    return item.id;
  }

  private makeItems(start: number, count: number): DemoItem[] {
    return Array.from({ length: count }, (_, index) => {
      const id = start + index;
      return {
        id,
        title: `Record ${id}`,
        text: `This item is intentionally variable-height so the demo exercises real layout changes and scroll anchoring.`,
        meta: `Loaded batch #${Math.ceil(id / 12)}`,
      };
    });
  }

  private makeMessages(start: number, count: number): ChatMessage[] {
    return Array.from({ length: count }, (_, index) => {
      const id = start + index;
      return {
        id,
        author: id % 2 ? 'Mina' : 'Arman',
        text:
          id % 3 === 0
            ? 'Here is a longer message. The important part of this demo is that loading older messages does not make the viewport jump.'
            : 'A chat message loaded from the previous page.',
        time: `10:${String((id * 7) % 60).padStart(2, '0')}`,
      };
    });
  }
}
