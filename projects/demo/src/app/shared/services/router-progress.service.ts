import { Service, signal } from '@angular/core';

@Service({
  autoProvided: true,
})
export class RouterProgressService {
  readonly progress = signal(0);
  readonly isVisible = signal(false);

  private intervalId?: ReturnType<typeof setInterval>;
  private hideTimeout?: ReturnType<typeof setTimeout>;

  start(): void {
    this.clearTimers();

    this.progress.set(0);
    this.isVisible.set(true);

    // شروع سریع
    this.progress.set(10);

    this.intervalId = setInterval(() => {
      const current = this.progress();

      if (current < 90) {
        const increment = Math.max(1, (90 - current) * 0.08);
        this.progress.set(Math.min(90, current + increment));
      }
    }, 150);
  }

  complete(): void {
    this.clearTimers();

    this.progress.set(100);

    this.hideTimeout = setTimeout(() => {
      this.isVisible.set(false);
      this.progress.set(0);
    }, 250);
  }

  cancel(): void {
    this.clearTimers();
    this.isVisible.set(false);
    this.progress.set(0);
  }

  private clearTimers(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    if (this.hideTimeout) {
      clearTimeout(this.hideTimeout);
      this.hideTimeout = undefined;
    }
  }
}
