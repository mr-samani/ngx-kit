import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DOCUMENT,
  ElementRef,
  EventEmitter,
  forwardRef,
  HostListener,
  inject,
  input,
  Input,
  OnInit,
  output,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { formatBoxShadowToCSS, parseBoxShadow, validateColor } from '../../utils/box-shadow-parser';
import { getOffsetPosition, OverlayService, WINDOW } from 'ngx-kit/core';
import { BoxShadow } from '../../contracts/BoxShadowValue';
import { NgxShadowControl } from '../shadow-control/shadow-control';

@Component({
  selector: 'ngx-box-shadow',
  templateUrl: './box-shadow.html',
  styleUrls: ['./box-shadow.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NgxShadowBox),
      multi: true,
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgxShadowBox implements OnInit, AfterViewInit {
  protected readonly maxRange = input(25);
  protected readonly shadowChange = output<string>();

  selectedIndex = signal(-1);

  shadows = signal<BoxShadow[]>([]);

  result = '';
  protected readonly doc = inject(DOCUMENT);
  protected readonly win = inject(WINDOW);
  protected readonly overlay = inject(OverlayService);
  protected readonly chdr = inject(ChangeDetectorRef);

  isDisabled: boolean = false;
  onChange = (_: string) => {};
  onTouched = () => {};

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }
  constructor() {}
  ngOnInit() {}
  ngAfterViewInit() {}
  writeValue(val: string): void {
    if (!val) {
      this.shadows.set([]);
      this.result = '';
      return;
    }
    this.shadows.set(parseBoxShadow(val));
    this.result = formatBoxShadowToCSS(this.shadows());
    // if (val !== this.result) {
    //   this.update();
    // }
  }

  addShadow(container: HTMLElement) {
    this.shadows.update((u) => [
      ...u,
      {
        xOffset: 0,
        yOffset: 0,
        blurRadius: 10,
        spreadRadius: 0,
        color: 'rgba(0, 0, 0, 0.5)',
        unit: 'px',
        inset: false,
      },
    ]);
    this.update();
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 100);
  }

  setShadow(el: HTMLElement, item: BoxShadow, index: number) {
    this.selectedIndex.set(index);
    this.overlay.open({
      component: NgxShadowControl,
      anchor: el,
      configure: (instance, ref) => {
        ref.componentRef?.setInput('maxRange', this.maxRange());
        ref.componentRef?.setInput('selectedShadow', item);
        instance.shadowChange.subscribe((v) => {
          item = v;
          this.shadows.update((shadows) => {
            shadows[this.selectedIndex()] = item;
            return shadows;
          });
          this.chdr.markForCheck();
          this.update();
        });
      },
      onClosed: () => {
        this.selectedIndex.set(-1);
      },
    });
  }

  removeShadow(ev: Event, index: number) {
    ev.stopPropagation();

    this.shadows().splice(index, 1);
    this.update();
  }

  private update() {
    this.result = formatBoxShadowToCSS(this.shadows());
    this.shadows().forEach((m) => (m.cssValue = formatBoxShadowToCSS([m])));
    this.onChange(this.result);
    this.shadowChange.emit(this.result);
  }
}
