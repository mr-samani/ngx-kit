import { Component, DebugElement, NgZone, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { vi } from 'vitest';
import { NgxInfiniteScroll } from './infinite-scroll.directive';
import { NgxInfiniteScrollDirection } from '../types/infinite-scroll.types';
@Component({
  standalone: true,
  imports: [NgxInfiniteScroll],
  template: `
    <div
      infiniteScroll
      [infiniteScrollDistance]="distance"
      [infiniteScrollDirection]="direction"
      [infiniteScrollUpDistance]="upDistance"
      [infiniteScrollDownDistance]="downDistance"
      [infiniteScrollDisabled]="disabled"
      [infiniteScrollImmediateCheck]="immediateCheck"
      [infiniteScrollMinInterval]="minInterval"
      [infiniteScrollMaintainScrollPosition]="maintainScrollPosition"
      [infiniteScrollPreserveScrollBehavior]="preserveScrollBehavior"
      [scrollWindow]="scrollWindow"
      [fromRoot]="fromRoot"
      [infiniteScrollContainer]="container"
      [infiniteScrollRoot]="root"
      (scrolled)="onScrolled($event)"
      (scrolledUp)="onScrolledUp($event)"
      (scrolledDown)="onScrolledDown($event)"
      (scrollStartReached)="onScrollStartReached($event)"
      (scrollEndReached)="onScrollEndReached($event)">
      @for (item of items; track item) {
        <div class="item">{{ item }}</div>
      }
    </div>
  `,
})
class TestHostComponent {
  distance = 200;
  direction: NgxInfiniteScrollDirection = 'down';
  upDistance: number | null = null;
  downDistance: number | null = null;
  disabled = false;
  immediateCheck = false;
  minInterval = 100;
  maintainScrollPosition = true;
  preserveScrollBehavior: ScrollBehavior = 'auto';
  scrollWindow = true;
  fromRoot = false;
  container: string | HTMLElement | null = null;
  root: HTMLElement | null = null;
  items = [1, 2, 3];
  onScrolled = vi.fn();
  onScrolledUp = vi.fn();
  onScrolledDown = vi.fn();
  onScrollStartReached = vi.fn();
  onScrollEndReached = vi.fn();
}

describe('NgxInfiniteScroll', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let host: TestHostComponent;
  let directive: NgxInfiniteScroll;
  let element: HTMLElement;
  let debugElement: DebugElement;
  beforeEach(async () => {
    TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: PLATFORM_ID, useValue: 'browser' }],
    });
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
    debugElement = fixture.debugElement.query(By.directive(NgxInfiniteScroll));
    directive = debugElement.injector.get(NgxInfiniteScroll);
    element = debugElement.nativeElement;
  });
  afterEach(() => {
    fixture.destroy();
    vi.restoreAllMocks();
  });
  // ---------------------------------------------------------------------------
  // Creation / public API
  // ---------------------------------------------------------------------------
  describe('creation', () => {
    it('should create', () => {
      expect(directive).toBeTruthy();
    });
    it('should expose the expected selector', () => {
      expect(debugElement).toBeTruthy();
      expect(debugElement.nativeElement.hasAttribute('infiniteScroll')).toBe(true);
    });
    it('should instantiate the directive for the infiniteScroll attribute', () => {
      expect(debugElement.injector.get(NgxInfiniteScroll)).toBe(directive);
    });

    it('should expose the expected default values', () => {
      expect(directive.infiniteScrollDistance()).toBe(200);
      expect(directive.infiniteScrollDisabled()).toBe(false);
      expect(directive.infiniteScrollImmediateCheck()).toBe(false);
      expect(directive.infiniteScrollMinInterval()).toBe(100);
      expect(directive.infiniteScrollUpDistance()).toBeNull();
      expect(directive.infiniteScrollDownDistance()).toBeNull();
      expect(directive.infiniteScrollDirection()).toBe('down');
      expect(directive.infiniteScrollMaintainScrollPosition()).toBe(true);
      expect(directive.infiniteScrollPreserveScrollBehavior()).toBe('auto');
      expect(directive.scrollWindow()).toBe(true);
      expect(directive.fromRoot()).toBe(false);
      expect(directive.infiniteScrollContainer()).toBeNull();
      expect(directive.infiniteScrollRoot()).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // Sentinels
  // ---------------------------------------------------------------------------
  describe('sentinels', () => {
    it('should create top and bottom sentinels', () => {
      const top = element.querySelector('[data-ngx-infinite-scroll-sentinel="top"]');
      const bottom = element.querySelector('[data-ngx-infinite-scroll-sentinel="bottom"]');
      expect(top).toBeTruthy();
      expect(bottom).toBeTruthy();
    });
    it('should mark sentinels as aria-hidden', () => {
      const sentinels = element.querySelectorAll('[data-ngx-infinite-scroll-sentinel]');
      expect(sentinels).toHaveLength(2);
      for (const sentinel of sentinels) {
        expect(sentinel.getAttribute('aria-hidden')).toBe('true');
      }
    });
    it('should clean up sentinels when destroyed', () => {
      expect(element.querySelector('[data-ngx-infinite-scroll-sentinel="top"]')).toBeTruthy();
      fixture.destroy();
      expect(document.querySelector('[data-ngx-infinite-scroll-sentinel="top"]')).toBeNull();
      expect(document.querySelector('[data-ngx-infinite-scroll-sentinel="bottom"]')).toBeNull();
    });
  });

  // ---------------------------------------------------------------------------
  // Trigger / outputs
  // ---------------------------------------------------------------------------
  describe('trigger', () => {
    it('should emit scrolled and scrolledDown for down direction', () => {
      host.direction = 'down';
      fixture.detectChanges();
      (directive as any).trigger('down');
      expect(host.onScrolled).toHaveBeenCalledOnce();
      expect(host.onScrolledDown).toHaveBeenCalledOnce();
      expect(host.onScrollEndReached).toHaveBeenCalledOnce();
      expect(host.onScrolledUp).not.toHaveBeenCalled();
      expect(host.onScrollStartReached).not.toHaveBeenCalled();
    });
    it('should emit scrolled and scrolledUp for up direction', () => {
      host.direction = 'up';
      fixture.detectChanges();
      (directive as any).trigger('up');
      expect(host.onScrolled).toHaveBeenCalledOnce();
      expect(host.onScrolledUp).toHaveBeenCalledOnce();
      expect(host.onScrollStartReached).toHaveBeenCalledOnce();
      expect(host.onScrolledDown).not.toHaveBeenCalled();
      expect(host.onScrollEndReached).not.toHaveBeenCalled();
    });

    it('should not emit twice while the same direction is disarmed', () => {
      host.direction = 'down';
      host.minInterval = 0;
      fixture.detectChanges();
      (directive as any).trigger('down');
      (directive as any).trigger('down');
      expect(host.onScrolledDown).toHaveBeenCalledOnce();
    });
  });

  // ---------------------------------------------------------------------------
  // Minimum interval
  // ---------------------------------------------------------------------------
  describe('minimum interval', () => {
    it('should allow a trigger after min interval has elapsed', () => {
      host.direction = 'down';
      host.minInterval = 100;
      fixture.detectChanges();
      const nowSpy = vi
        .spyOn(performance, 'now')
        .mockReturnValueOnce(1000)
        .mockReturnValueOnce(1200);
      (directive as any).trigger('down');
      (directive as any).armedDown = true;
      (directive as any).trigger('down');
      expect(host.onScrolledDown).toHaveBeenCalledTimes(2);
      nowSpy.mockRestore();
    });
  });

  // ---------------------------------------------------------------------------
  // Immediate check
  // ---------------------------------------------------------------------------
  describe('immediate check', () => {
    it('should not schedule a check when immediate check is disabled', () => {
      const scheduleSpy = vi.spyOn(directive as any, 'scheduleCheck');
      host.immediateCheck = false;
      fixture.detectChanges();
      expect(scheduleSpy).not.toHaveBeenCalled();
    });
  });

  // ---------------------------------------------------------------------------
  // Check API
  // ---------------------------------------------------------------------------
  describe('check()', () => {
    it('should schedule a visibility check', () => {
      const scheduleSpy = vi.spyOn(directive as any, 'scheduleCheck');
      directive.check();
      expect(scheduleSpy).toHaveBeenCalledOnce();
    });

    // ---------------------------------------------------------------------------
    // Prepend / scroll position
    // ---------------------------------------------------------------------------
    describe('prepend scroll preservation', () => {
      it('should capture scroll metrics when up direction is triggered', () => {
        host.direction = 'up';
        host.maintainScrollPosition = true;
        host.minInterval = 0;
        fixture.detectChanges();
        const captureSpy = vi.spyOn(directive as any, 'capturePrependSnapshot');
        (directive as any).trigger('up');
        expect(captureSpy).toHaveBeenCalledOnce();
      });
      it('should finish a pending prepend operation through completePrepend', () => {
        const tryCompensateSpy = vi.spyOn(directive as any, 'tryCompensatePrepend');
        directive.completePrepend();
        expect(tryCompensateSpy).toHaveBeenCalledWith(true);
      });
    });

    // ---------------------------------------------------------------------------
    // Browser lifecycle / cleanup
    // ---------------------------------------------------------------------------
    describe('cleanup', () => {
      it('should disconnect observers on destroy', () => {
        const observer = (directive as any).observer as IntersectionObserver;
        const resizeObserver = (directive as any).resizeObserver as ResizeObserver;
        const mutationObserver = (directive as any).mutationObserver as MutationObserver;
        const observerDisconnect = vi.spyOn(observer, 'disconnect');
        const resizeDisconnect = vi.spyOn(resizeObserver, 'disconnect');
        const mutationDisconnect = vi.spyOn(mutationObserver, 'disconnect');
        fixture.destroy();
        expect(observerDisconnect).toHaveBeenCalledOnce();
        expect(resizeDisconnect).toHaveBeenCalledOnce();
        expect(mutationDisconnect).toHaveBeenCalledOnce();
      });
      it('should mark the directive as destroyed', () => {
        fixture.destroy();
        expect((directive as any).destroyRequested).toBe(true);
      });
      it('should cancel a pending prepend animation frame on destroy', () => {
        const cancelSpy = vi.spyOn(window, 'cancelAnimationFrame');
        (directive as any).prependFrame = 123;
        fixture.destroy();
        expect(cancelSpy).toHaveBeenCalledWith(123);
      });
    });
  });
});
